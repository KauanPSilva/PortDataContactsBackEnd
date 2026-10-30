function isValidName(nome) {
    if (typeof nome !== 'string') {
        return false;
    }

    const words = nome.trim().split(/\s+/);

    return words.length >= 2 &&
        words.every(word => /^\p{L}{3,}$/u.test(word));
}

function isValidId(id) {
    return /^[1-9]\d*$/.test(String(id)) &&
        Number.isSafeInteger(Number(id));
}

function isValidPhone(telefone) {
    return typeof telefone === 'string' && telefone.trim().length > 0;
}

module.exports = {
    isValidName,
    isValidId,
    isValidPhone
};