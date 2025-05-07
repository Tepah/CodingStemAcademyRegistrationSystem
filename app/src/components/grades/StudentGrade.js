import React, {useState, useEffect} from 'react';

import SingleGradeTable from '../tables/grades/singleGradeTable';


export default function StudentGrade() {


    return (
        <div className="container mx-auto flex flex-col p-4 gap-4">
            <SingleGradeTable />
        </div>
    );
}