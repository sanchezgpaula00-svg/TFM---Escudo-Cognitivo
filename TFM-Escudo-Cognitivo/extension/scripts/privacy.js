// 🛡️ MÓDULO DE PRIVACIDAD (Sanitización)
const PrivacyFilter = {
    sanitizar: function(texto) {
        const patrones = {
            dni: /[0-9]{8}[A-Z]/g,
            tarjeta: /\b(?:\d[ -]*?){13,16}\b/g,
            email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
            telefono: /(\+34|0034|34)?[ -]*(6|7|8|9)[ -]*([0-9][ -]*){8}/g
        };

        let limpio = texto;
        limpio = limpio.replace(patrones.dni, "[DNI_ELIMINADO]");
        limpio = limpio.replace(patrones.tarjeta, "[TARJETA_ELIMINADA]");
        limpio = limpio.replace(patrones.email, "[EMAIL_ELIMINADO]");
        limpio = limpio.replace(patrones.telefono, "[TEL_ELIMINADO]");
        
        return limpio;
    }
};