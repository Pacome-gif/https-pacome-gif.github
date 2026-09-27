package com.ibizabroker.bibliotheque.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class WebSecurityConfiguration extends WebSecurityConfigurerAdapter {

    @Autowired
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Autowired
    private JwtRequestFilter jwtRequestFilter;

    @Autowired
    private UserDetailsService jwtService;

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .cors().and()
            .csrf().disable()
            .authorizeRequests()
                .antMatchers("/authenticate").permitAll()
                .antMatchers("/swagger-ui/**", "/swagger-ui.html", "/v3/api-docs/**", "/api-docs/**").permitAll()
                // Le catalogue des livres doit être consultable par tout utilisateur authentifié :
                // un simple ADHERENT en a besoin pour choisir quel livre réserver. Cette règle doit
                // précéder "/admin/books/**" ci-dessous : ce motif matche aussi le chemin exact
                // /admin/books (pas seulement ses sous-chemins), donc s'il passait en premier, un
                // ADHERENT se ferait bloquer y compris en lecture (antMatchers = première
                // correspondance qui matche, la suite n'est jamais évaluée).
                .antMatchers(org.springframework.http.HttpMethod.GET, "/admin/books").authenticated()
                // Le BIBLIOTHECAIRE gère le quotidien de la bibliothèque au même titre qu'Admin :
                // catalogue des livres et gestion des adhérents (listing, fiche, création,
                // modification). Reste avant la règle générale /admin/** (Admin uniquement).
                .antMatchers("/admin/books/**").hasAnyRole("Admin", "BIBLIOTHECAIRE")
                .antMatchers("/admin/users/**").hasAnyRole("Admin", "BIBLIOTHECAIRE")
                .antMatchers("/admin/**").hasRole("Admin")
                .antMatchers("/api/reservations/**").authenticated()
                .anyRequest().authenticated()
            .and()
            .exceptionHandling()
                .authenticationEntryPoint(jwtAuthenticationEntryPoint)
            .and()
            .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder authenticationManagerBuilder) throws Exception {
        authenticationManagerBuilder.userDetailsService(jwtService).passwordEncoder(passwordEncoder());
    }
}