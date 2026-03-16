import { useEffect, useState } from "react";
import CardPartner from "../components/CardPartner";
import * as API from '../services/institucions.service';
export default function Partners() {

    const [partners, setPartners] = useState([]);

    useEffect(() => {

        API.getActivePartners()
            .then((res) => {
                setPartners(res?.data)
            })
            .catch((err) => {
                console.log(err);
            })
    }, [])

    return (
        <>
            <main className="grid grid-cols-1">
                <section className="z-0 backdrop-blur-sm w-screen flex justify-center items-center">
                    <h1 className="w-full text-4xl font-extrabold tracking-tight text-blue_primary text-center leading-none md:text-5xl xl:text-6xl"> Instituciones Asociadas</h1>
                </section>
                <section className="grid grid-cols-3 px-20 gap-5 w-full">
                    {
                        partners.length > 0 &&

                        partners.map((partner, index) => {
                            return (
                                <div key={index} className="flex items-center justify-center">
                                    <CardPartner partner={partner} />
                                </div>
                            )
                        })
                    }
                </section>
            </main>
        </>
    )
}