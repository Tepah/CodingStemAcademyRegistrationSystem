import React, {useState, useEffect} from 'react';
import SingleGradeTable from '../tables/grades/singleGradeTable';
import { useRouter } from 'next/router';
import { jwtDecode } from 'jwt-decode';


export default function StudentGrade() {
    const [user, setUser] = useState({});
    const router = useRouter();
    const { class_id } = router.query;

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/").then(() => {
                console.log("Redirected to home page");
            });
        } else {
            const decodedToken = jwtDecode(token);
            setUser(decodedToken["sub"]);
            console.log("Decoded token:", decodedToken);
        }
    }
    , []);



    return (
        <div className="container mx-auto flex flex-col p-4 gap-4">
            <SingleGradeTable student_id={user.id} class_id={class_id} personal={true} />
        </div>
    );
}