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
            <main className="grid grid-cols-1 w-full">
                <section aria-labelledby="partners-title" className="z-0 backdrop-blur-sm w-full flex justify-center items-center px-4 pt-8">
                    <h1 id="partners-title" className="w-full max-w-screen-xl text-4xl font-display font-extrabold tracking-tight text-blue_primary text-center leading-none md:text-5xl xl:text-6xl"> Instituciones Asociadas</h1>
                </section>
                <section aria-label="Listado de instituciones asociadas" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
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