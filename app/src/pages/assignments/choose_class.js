import React, { useState, useEffect } from 'react';
import {Layout} from "@/components/layout/Layout";
import {jwtDecode} from "jwt-decode";
import Link from "next/link";
import { getAllClassesForTeacher } from '@/components/api/api';
import { Card, CardContent } from '@/components/ui/card'

// literally just put a list of classes as boxes
export default function SelectClassFromList () {
	const [user, setUser] = useState([]);
	const [classList, setClassList] = useState([]);
	const crumbs = [
    { name: 'Home', href: '/dashboard' },
    { name: 'Assignments', href: '/assignments' },
	{ name: 'Choose Class', href: '/choose_class' },
  ];
	
	useEffect(() => {
		// Get user from JWT token
		const token = localStorage.getItem('token');
		if (!token) {
			router.push('/').then(() => {console.log("Returning logged out user to main")})
		}
		const user = jwtDecode(token);
		setUser(user['sub']);
		console.log("user", user);

		// retrieve all classes into a list
		getAllClassesForTeacher(user['sub'].id).then(response => setClassList(response));
	
		console.log("classList", classList);
	}, []);

	return (
		<Layout breadcrumbs={crumbs}>
			<div className="container max-w-[900px] mx-auto p-8 flex flex-col flex-1 space-y-4">
				<h1><b>Choose a class to add an assignment to.</b></h1>
				{classList.map((classData) =>
					<Link key={classData.id} href={`/classes/${classData.id}/assignments/create`}>
						<Card className="flex-col gap-2 w-full max-w-sm">
						<CardContent>
							{classData.class_name}
						</CardContent>
						</Card>
					</Link>
				)}

			
			</div>
		</Layout>
	);
}