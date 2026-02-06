export const puedeAcceder = (rol: string | null, permitidos: string[]) => {
    if (!rol) return false;
    return permitidos.includes(rol);
};
