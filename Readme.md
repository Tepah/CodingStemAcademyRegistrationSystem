## AI-Powered Course Assignment Project
___
### Teacher: Mr. Ryan
### Team:
- **Owen Chen**
- Brandon Pian
- Emily Wang

### Summary:
- A course assignment system that enhances the learning process by automating assignments, grading, and providing personalized feedback through AI enhancements. When a student submits an assignment this would use computer vision to analyze the things on paper, then provide AI created solutions/feedback to the user/teacher. This will give individual students more feedback without having to ask the teacher, while also giving the teacher more time to focus on other tasks. 

### Requirements:
- Student profiles
- Assignment Generation
- Grading System
- Feedback system
- Analytics
- Notifications and Alerts - Calendar system? // optional
- Admin Page - Permission based security

### Technologies:
- Backend - Flask or Node.js
	- Machine Learning Libraries: Scikit-learn, tensorFlow, or Pytorch for AI tasks
	- Database: MySQL to store data
- Frontend
	- React
	- HTML/CSS - tailwind?
- AI:
	- Assignment generation: Natural Language Processing (NLP)
	- Grading: Computer vision or NLP to Analyze and grade responses
	- Feedback/recommendations: Collaborative filtering/supervised learning. 

### Concerns?
- Should students get similar assignments if in same class so they can collaborate?
- Are we looking at doing assignments on the computer?

### How to run:
- create 2 new terminals
- cd CodingStemAcademyRegistrationSystem in both of them
- In one of the terminals
- cd server
- then run
- python run.py
- Then, in the other terminals, run
- cd app
- Then run
- npm run dev
- Congrats, you ran the app
- ctrl + click on the network URL
- Congrats, you have the website working :)
  


## AI-Powered Score Submissions System Project
___
### Teacher: Mr. Joshua, Mr. Brian
### Team:
- **Kenny**
- Arick Hong
- Audrey Don
- Spincer Wang

### Summary:
- An score submission system that uses AI for score validation, feedback generation, and predictive analysis would allow for efficient score management, personalized feedback, and intelligent insights for educators to better track student progress. Would work hand in hand with the Assignment Project because scores should be handled with each other and seen by one another. 
- Basic score submission. 

### Requirements:
- Admin page
- Score page
- Profile page
- Course page


## AI Scheduling
___
### Teacher: Mr. Pete

### Team:
- **Aidan Hong**
- Emily Ma
- Ethan Liu

### Requirements
- User information - Username, cardIDs
- Address Information - addresses
- Card information - name on card, card file
- Admin page
	- Change address information/user information/etc
	- Ban users
	- removes charges/edit charges.
- Payment processing
- Front end
	- Payment
	- Cart Page
	- Summary Page
	- Pay ahead feature/ auto Pay
- Email Notifications for payments

### Technologies 
Python (flask)
SQLite

### Notes:
___


## AI Registration
___
### Teacher: Mr. Pete

### Team:
- **Zichun Hong**
- Darren Wang
- Mary Liang
- Richard Wang

### Requirements
-  Basic Information
	- Name, age, grade, address, Phone number, High school, Email, Gender, DOB, Volunteer services, extra curricular, Race
	- Input grades manually?
	- GPA
- Transcripts - less priority
- Front end
	- Dashboard when logged in
	- Admin Page
	- Profile page
	- Sign up pages
	- Log in page
	- Course Selection page
- Permissions
	- Admin - Mr. Jimmy Ms. Susie
	- Teacher - Mr. Pete and Ms. Joyce
	- Student
- AI Features
	- personalized course recommendations
	- Predicting course enrollments based on student data

### Technologies
- Flask
- Pandas
- scikit-learn
- React
