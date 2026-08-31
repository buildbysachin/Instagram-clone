import RegisterUser from "@/component/auth/registerUser";

const createAccount =()=>{
    return (
        <div
        className="min-h-screen w-screen bg-slate-950 flex justify-center pt-7"
        >
            <RegisterUser/>
        </div>
    )
}
export default createAccount;