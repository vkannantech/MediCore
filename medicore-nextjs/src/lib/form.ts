import { Prisma } from "@prisma/client";
import { redirect, unstable_rethrow } from "next/navigation";
import { revalidatePath } from "next/cache";

/** Validation failure whose message is safe to show to the user. */
export class FormError extends Error {}

type Bounds = { min?: number; max?: number };

export function text(formData: FormData, name: string, label: string, opts: { required?: boolean; max?: number } = {}) {
  const value = String(formData.get(name) ?? "").trim();
  if (opts.required && !value) throw new FormError(`${label} is required.`);
  if (opts.max && value.length > opts.max) throw new FormError(`${label} must be at most ${opts.max} characters.`);
  return value;
}

export function optionalText(formData: FormData, name: string, label: string, max?: number) {
  return text(formData, name, label, { max }) || null;
}

export function int(formData: FormData, name: string, label: string, bounds: Bounds = {}) {
  const raw = String(formData.get(name) ?? "").trim();
  const value = Number(raw);
  if (!raw || !Number.isInteger(value)) throw new FormError(`${label} must be a whole number.`);
  checkBounds(value, label, bounds);
  return value;
}

export function optionalInt(formData: FormData, name: string, label: string, bounds: Bounds = {}) {
  const raw = String(formData.get(name) ?? "").trim();
  return raw ? int(formData, name, label, bounds) : null;
}

export function money(formData: FormData, name: string, label: string) {
  const raw = String(formData.get(name) ?? "").trim();
  if (!/^\d{1,10}(\.\d{1,2})?$/.test(raw)) throw new FormError(`${label} must be a positive amount with up to 2 decimals.`);
  return raw;
}

/** Parses an <input type="date"> value (YYYY-MM-DD) as a UTC date-only value. */
export function dateOnly(formData: FormData, name: string, label: string) {
  const raw = String(formData.get(name) ?? "").trim();
  const date = new Date(`${raw}T00:00:00.000Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw) || Number.isNaN(date.getTime())) throw new FormError(`${label} must be a valid date.`);
  return date;
}

export function oneOf<T extends string>(formData: FormData, name: string, label: string, allowed: readonly T[]): T {
  const value = String(formData.get(name) ?? "").trim();
  if (!(allowed as readonly string[]).includes(value)) throw new FormError(`${label} must be one of: ${allowed.join(", ")}.`);
  return value as T;
}

function checkBounds(value: number, label: string, { min, max }: Bounds) {
  if (min !== undefined && value < min) throw new FormError(`${label} must be at least ${min}.`);
  if (max !== undefined && value > max) throw new FormError(`${label} must be at most ${max}.`);
}

function toMessage(err: unknown) {
  if (err instanceof FormError) return err.message;
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        return "A record with this value already exists.";
      case "P2003":
        return "This action references a record that does not exist, or the record is still linked to other data (appointments, bills, records or reports).";
      case "P2025":
        return "The record no longer exists. Refresh the page and try again.";
    }
  }
  console.error("[form action]", err);
  return "Something went wrong while saving. Please try again.";
}

/**
 * Runs a form mutation, then redirects back to `path` with `?ok=` or `?error=`
 * so the page can show the outcome instead of crashing on bad input.
 */
export async function runFormAction(path: string, fn: () => Promise<string>, alsoRevalidate: string[] = []) {
  let target: string;
  try {
    const message = await fn();
    for (const p of [path, ...alsoRevalidate]) revalidatePath(p);
    target = `${path}?ok=${encodeURIComponent(message)}`;
  } catch (err) {
    unstable_rethrow(err);
    target = `${path}?error=${encodeURIComponent(toMessage(err))}`;
  }
  redirect(target);
}
