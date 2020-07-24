interface RefreshTokenDTO {
    token: string,
    device: string,
    isActive: boolean,
    userId: string
}

interface TokenDTO {
    token: string
}

export { RefreshTokenDTO, TokenDTO };