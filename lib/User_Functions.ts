class User_Functions {
    public AddOneDayFunction(inputTime: Date) {
        return new Date(+inputTime + 86400);
    }
}
export default User_Functions;
