export interface Jwtres {
  datosUsuario: {
    id: number,
    usuario: string,
    correo: string,
    clave: string,
    accessToken: string,
    expiresIn: string
  }
}