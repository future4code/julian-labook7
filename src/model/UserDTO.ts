interface UserSignupDTO {
    id: string;
    name: string;
    email: string;
    password: string;  
};

interface UserIdDTO {
    id: string;
}
export { UserSignupDTO, UserIdDTO }