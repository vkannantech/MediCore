package com.medicore.security;

import com.medicore.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.Collections;

public class UserDetailsImpl implements UserDetails {
    private Long id;
    private String email;
    private String password;
    private Collection<? extends GrantedAuthority> authorities;
    private String role;

    public UserDetailsImpl(Long id, String email, String password, Collection<? extends GrantedAuthority> authorities, String role) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.authorities = authorities;
        this.role = role;
    }

    public static UserDetailsImpl build(User user) {
        GrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + user.getRole().name());
        return new UserDetailsImpl(
                user.getId(),
                user.getEmail(),
                user.getPassword(),
                Collections.singletonList(authority),
                user.getRole().name()
        );
    }

    public Long getId() { return id; }
    public String getRole() { return role; }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() { return authorities; }
    @Override
    public String getPassword() { return password; }
    @Override
    public String getUsername() { return email; }
    @Override
    public boolean isAccountNonExpired() { return true; }
    @Override
    public boolean isAccountNonLocked() { return true; }
    @Override
    public boolean isCredentialsNonExpired() { return true; }
    @Override
    public boolean isEnabled() { return true; }
}
