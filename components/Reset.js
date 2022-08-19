import { useRouter } from 'next/router';

const Reset = () => {

    const router = useRouter();

    const doReset = (e) => {
        e.preventDefault();
        localStorage.removeItem('userId');
        localStorage.setItem('started', false);
        router.push("/");
    }

    return (
        <div className="reset"><a href="#" onClick={doReset}>reset the game</a></div>
    )
}

export default Reset;