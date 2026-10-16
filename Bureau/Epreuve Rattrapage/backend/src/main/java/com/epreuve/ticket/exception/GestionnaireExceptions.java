package com.epreuve.ticket.exception;

import com.epreuve.ticket.dto.MessageErreur;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

/**
 * Traduit les exceptions en reponses HTTP explicites.
 * Aucun refus ne doit ressembler a une "erreur serveur" generique.
 */
@RestControllerAdvice
public class GestionnaireExceptions {

    /** Validation du DTO en entree : titre absent ou trop long -> 400. */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<MessageErreur> gererValidation(MethodArgumentNotValidException ex) {
        List<String> details = ex.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .toList();

        String message = details.isEmpty()
                ? "RG-01 : la requête est invalide."
                : String.join(" ", details);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new MessageErreur(HttpStatus.BAD_REQUEST.value(), "RG-01", message, details));
    }

    /** Identifiant inconnu -> 404. */
    @ExceptionHandler(RessourceIntrouvableException.class)
    public ResponseEntity<MessageErreur> gererIntrouvable(RessourceIntrouvableException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new MessageErreur(HttpStatus.NOT_FOUND.value(), null, ex.getMessage(), null));
    }

    /** Regle de gestion violee -> 409, avec le nom de la regle. */
    @ExceptionHandler(RegleMetierException.class)
    public ResponseEntity<MessageErreur> gererRegleMetier(RegleMetierException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new MessageErreur(HttpStatus.CONFLICT.value(), ex.getRegle(), ex.getMessage(), null));
    }

    /**
     * Filet de securite : si deux creations concurrentes passent la verification
     * applicative, la contrainte d'unicite PostgreSQL (uk_ticket_titre) renvoie 409.
     */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<MessageErreur> gererContrainte(DataIntegrityViolationException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new MessageErreur(
                        HttpStatus.CONFLICT.value(),
                        "RG-02",
                        "RG-02 : un ticket avec ce titre existe déjà.",
                        null));
    }
}
