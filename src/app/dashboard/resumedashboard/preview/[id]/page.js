"use client"
import React, { useEffect, useState } from 'react';
import Template1 from '@/components/resume/resumeTemplete/Templete1';
import Template2 from '@/components/resume/resumeTemplete/Templete2';
import Templete3 from '@/components/resume/resumeTemplete/Templete3';
import apiClient from '@/lib/apiClient';
import Loading from '@/components/Loading';
import { useParams } from 'next/navigation';

const Page=() => {
    // api call for data

    const [resumeData, setResumeData] = useState(null);
    const [loading, setLoading] = useState(true)
    const { id } = useParams()

    const fetchData = async () => {
        try {
            const response = await apiClient(`/api/resume/${id}`); // Replace with your API
            if (response.data.success) {
                setResumeData(response.data.data);
                setLoading(false)
            }
        } catch (error) {
            console.error("Error fetching resume data:", error);
        }
    };

    useEffect(() => {
        if (id) fetchData();
    }, [id]);
    

    if (loading) {
        return <Loading />
    }

    return (
        <>
            <div 
    //         style={{ overflowY: "auto", padding: "20px",
    // display: "flex",
    // justifyContent:"center",
    // alignItems: "flex-start",
    // backgroundColor: "#f4f4f4",
    // height: "100vh"}}
    >
                {resumeData.customization.template === "template1" && <Template1 resume={resumeData} />}
                {resumeData.customization.template === "template2" && <Template2 resume={resumeData} />}
                {resumeData.customization.template === "template3" && <Templete3 resume={resumeData} />}
            </div>
        </>
    )
}
export default Page;