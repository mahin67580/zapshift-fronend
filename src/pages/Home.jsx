import React from 'react';
import Banner from '../component/Banner';
import Services from '../component/Services';
import Brands from '../component/Brands';
import Steps from '../component/Steps';
import Service from '../component/Service';
import CustomerComments from '../component/CustomerComments';
import { useLoaderData } from 'react-router';


const Home = () => {
    const Centers = useLoaderData();
    console.log(Centers);
    return (
        <div>

            <div className="banner">
                <Banner></Banner>
            </div>
            <div>
                <Services></Services>
            </div>
            <div>
                <Brands></Brands>
            </div>
            <div>
                <Steps></Steps>
            </div>
            <Service></Service>
            <CustomerComments></CustomerComments>
        </div>
    );
};

export default Home;