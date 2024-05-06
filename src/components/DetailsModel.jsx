import React, { useEffect, useRef } from 'react'
import './DetailsModel.css';

export default function DetailsModel({ showModel, data, unique, setShowModel }) {

    const modal1BtnRef = useRef(null);
    const modal2BtnRef = useRef(null);
    const closefirst = useRef(null);
    const closeSecond = useRef(null);

    useEffect(() => {
        if (showModel) {
            modal1BtnRef.current.click();
        }
    }, [showModel, data]);

    const goToFirstModel = () => {
        closeSecond.current.click();
        modal1BtnRef.current.click();
    }

    const goToSecondModal = () => {
        closefirst.current.click();
        modal2BtnRef.current.click();
        // fetchHomeWorld(data.homeworld);
    };

    function formatDate(isoDateString) {
        const date = new Date(isoDateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
    }

    return (
        <>
            <button type="button" ref={modal1BtnRef} className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target={"#staticBackdrop" + unique}>
                Launch static backdrop modal
            </button >
            <div className="modal fade" id={"staticBackdrop" + unique} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                < div className="modal-dialog modal-dialog-centered">
                    < div className="modal-content">
                        < div className="modal-header">
                            < button type="button" className="invisible"></button>
                            < h3 style={{ width: "100%", textAlign: "center" }
                            } className="modal-title fs-5" id="staticBackdropLabel">{data.name}</h3>
                            < button type="button" ref={closefirst} className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setShowModel(false)}></button>
                        </div >
                        <div className="modal-body">
                            < div className='container' >
                                <img src={data.image} alt={data.name}></img>
                            </div >
                            <p className='mt-3'><span>Height :</span>&nbsp;{data.height / 100} Meter</p>
                            <p><span>Mass :</span> &nbsp;{data.mass} Kg</p>
                            <p><span>Number Of Films :</span>&nbsp; {data.films.length}</p>
                            <p><span>Birth Year :</span> &nbsp;{data.birth_year}</p>
                            <p><span>Date Added :</span> &nbsp;{formatDate(data.created)}</p>

                        </div >
                        <div className="modal-footer">
                            < button type="button" className="btn btn-secondary" ref={closefirst} data-bs-dismiss="modal" onClick={() => setShowModel(false)}>Close</button>
                            < button type="button" name={unique} className="btn btn-danger" onClick={goToSecondModal}>HomeWorld Details</button>
                        </div >
                    </div >
                </div >
            </div >

            <button type="button" ref={modal2BtnRef} className="btn btn-primary d-none" data-bs-target={"#staticBackdrop" + unique + unique} data-bs-toggle="modal">HomeWorld Details</button>
            < div className="modal fade" id={"staticBackdrop" + unique + unique} aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabIndex="-1">
                < div className="modal-dialog modal-dialog-centered">
                    < div className="modal-content">
                        < div className="modal-header">
                            < button type="button" className="invisible"></button>
                            < h3 style={{ width: "100%", textAlign: "center" }} className="modal-title fs-5" id="exampleModalToggleLabel2">HomeWorld</h3>
                            < button type="button" ref={closeSecond} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div >
                        <div className="modal-body">
                            <p><span>Planet Name :</span> &nbsp;{data.homeworlddata.name}</p>
                            <p><span>Terrain :</span> &nbsp;{data.homeworlddata.terrain}</p>
                            <p><span>Climate :</span>&nbsp; {data.homeworlddata.climate}</p>
                            <p><span>Population :</span> &nbsp;{data.homeworlddata.population}</p>
                        </div >
                        <div className="modal-footer">
                            < button className="btn btn-danger" onClick={goToFirstModel}>Back</button>
                        </div >
                    </div >
                </div >
            </div >
        </>
    )
}
