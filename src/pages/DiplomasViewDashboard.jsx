import { useEffect, useState } from "react";
import DeleteModal from "../components/DeleteModal";
import HeadTableDiplomas from "../components/HeadTableDiplomas";
import ReadDiplomaModal from "../components/ReadDiplomaModal";
import UpdateDiplomaModal from "../components/UpdateDiplomaModal";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AdminDiplomasTable from "../components/AdminDiplomasTable";
import { useInstitutionsContext } from "../context/InstitutionsContext";

import * as API from '../services/institucions.service.js';

export default function DiplomasViewDashboard() {

    const { authUser } = useAuth()
    const { setIntitutions } = useInstitutionsContext();
    const navigate = useNavigate();
    const role = authUser?.rol
    const TOKEN = localStorage.getItem('TOKEN')

    const [openModalEditDiploma, setOpenModalEditDiploma] = useState("" | undefined);
    const [openModalPreviewDiploma, setOpenModalPreviewDiploma] = useState("" | undefined);
    const [openModalDeleteDiploma, setOpenModalDeleteDiploma] = useState("" | undefined);


    const [diplomaUpdate, setDiplomaUpdate] = useState(null)

    const [diplomas, setDiplomas] = useState([]);
    const props = {
        openModalEditDiploma,
        setOpenModalEditDiploma,
        openModalPreviewDiploma,
        setOpenModalPreviewDiploma,
        openModalDeleteDiploma,
        setOpenModalDeleteDiploma,
        diplomas,
        setDiplomaUpdate,
    }

    const getInstitutions = async () => {
        const res = await API.getInstitutions(TOKEN);
        console.log(res.data);
        setIntitutions(res?.data)
    }


    async function getDiplomas() {
        try {
            const respuesta = await fetch("http://localhost:4000/api/diplomas", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `${TOKEN}`
                },
            });

            const data = await respuesta.json();

            console.log(data);
            if (data.error) {
                console.log(data.error);
            } else {
                setDiplomas(data)
            }


        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (role == 'ADMIN') {
            getDiplomas();
            getInstitutions();
        }
    }, [])

    return (
        <>
            {/* <!-- Start block --> */}
            <section className=" bg-gray-50 dark:bg-gray-900 sm:p-5 antialiased">
                <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
                    {/* <!-- Start coding here --> */}
                    <div className="min-h-[30rem] bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
                        <HeadTableDiplomas />
                        <div className=" overflow-x-auto">
                            {/* <!-- Table --> */}
                            {
                                diplomas.length > 0 ? (
                                    <AdminDiplomasTable props={props} />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <p className="text-gray-500 dark:text-gray-400">No hay diplomas para mostrar</p>
                                    </div>
                                )
                            }

                        </div>
                        <nav className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4" aria-label="Table navigation">
                            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                Showing
                                <span className="font-semibold text-gray-900 dark:text-white px -2"> 1-10 </span>
                                of
                                <span className="font-semibold text-gray-900 dark:text-white px-2">1000</span>
                            </span>
                            <ul className="inline-flex items-stretch -space-x-px">
                                <li>
                                    <a href="#" className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                                        <span className="sr-only">Previous</span>
                                        <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                                        </svg>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">1</a>
                                </li>
                                <li>
                                    <a href="#" className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">2</a>
                                </li>
                                <li>
                                    <a href="#" aria-current="page" className="flex items-center justify-center text-sm z-10 py-2 px-3 leading-tight text-primary-600 bg-primary-50 border border-primary-300 hover:bg-primary-100 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white">3</a>
                                </li>
                                <li>
                                    <a href="#" className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">...</a>
                                </li>
                                <li>
                                    <a href="#" className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">100</a>
                                </li>
                                <li>
                                    <a href="#" className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                                        <span className="sr-only">Next</span>
                                        <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                                        </svg>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </section>
            {/* <!-- End block --> */}
            {/* <!-- Update modal --> */}
            <UpdateDiplomaModal props={{ openModalEditDiploma, setOpenModalEditDiploma }} diplomaUpdate={diplomaUpdate} />
            {/* <!-- Read modal --> */}
            <ReadDiplomaModal props={{ openModalPreviewDiploma, setOpenModalPreviewDiploma, }} />
            {/* <!-- Delete modal --> */}
            <DeleteModal props={{ openModalDeleteDiploma, setOpenModalDeleteDiploma }} />
        </>
    )
}