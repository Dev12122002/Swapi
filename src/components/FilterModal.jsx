import React from 'react'
import { useState, useEffect, useRef } from 'react'
import './DetailsModel.css';
export default function FilterModal(props) {

    const [selectedPlanets, setSelectedPlanets] = useState([]);
    const [selectedFilms, setSelectedFilms] = useState([]);
    const [selectedSpecies, setSelectedSpecies] = useState([]);

    const modal1BtnRef = useRef(null);

    const ApplyFilter = () => {

        props.setSelectedPlanets(selectedPlanets);
        props.setSelectedFilms(selectedFilms);
        props.setSelectedSpecies(selectedSpecies);

        props.setShowFilterModel(false);
    };

    useEffect(() => {

        if (props.showFilterModel) {
            modal1BtnRef.current.click();
        }

    }, [props.showFilterModel]);

    // Function to handle checkbox selection/deselection
    const handlePlanetChange = (event) => {
        const { value, checked } = event.target;
        if (checked) {
            // Add checkbox value to selectedCheckboxes array
            setSelectedPlanets([...selectedPlanets, value]);
        } else {
            // Remove checkbox value from selectedCheckboxes array
            setSelectedPlanets(selectedPlanets.filter(item => item !== value));
        }
    };

    const handleFilmChange = (event) => {
        const { value, checked } = event.target;
        if (checked) {
            // Add checkbox value to selectedCheckboxes array
            setSelectedFilms([...selectedFilms, value]);
        } else {
            // Remove checkbox value from selectedCheckboxes array
            setSelectedFilms(selectedFilms.filter(item => item !== value));
        }
    };

    const handleSpecieChange = (event) => {
        const { value, checked } = event.target;
        if (checked) {
            // Add checkbox value to selectedCheckboxes array
            setSelectedSpecies([...selectedSpecies, value]);
        } else {
            // Remove checkbox value from selectedCheckboxes array
            setSelectedSpecies(selectedSpecies.filter(item => item !== value));
        }
    };

    return (
        <>
            <button type="button" ref={modal1BtnRef} className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                Launch static backdrop modal
            </button >
            <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                < div className="modal-dialog modal-dialog-scrollable">
                    < div className="modal-content">
                        < div className="modal-header">
                            < button type="button" className="invisible"></button>
                            < h1 style={{ width: "100%", textAlign: "center" }
                            } className="modal-title fs-5" id="staticBackdropLabel">Filter</h1>
                            < button type="button" className="btn-close d-none" data-bs-dismiss="modal" aria-label="Close" onClick={() => props.setShowFilterModel(false)}></button>
                        </div >
                        <div className="modal-body">
                            {/* {props.planets}{props.species}{props.films} */}

                            <h5>Planets</h5>
                            <div className='row d-flex justify-content-evenly'>
                                {props.planets.map((option, index) => (
                                    <div key={index} className='col-4'>
                                        <input
                                            type="checkbox"
                                            id={option}
                                            value={option}
                                            checked={selectedPlanets.includes(option)}
                                            onChange={handlePlanetChange}
                                        />
                                        <label className='p-2' htmlFor={option}>{option}</label>
                                    </div>
                                ))}

                            </div>

                            <hr />
                            <h5>Films</h5>
                            <div className='d-flex flex-column justify-content-evenly'>
                                {props.films.map((option, index) => (
                                    <div key={index}>
                                        <input
                                            type="checkbox"
                                            id={option}
                                            value={option}
                                            checked={selectedFilms.includes(option)}
                                            onChange={handleFilmChange}
                                        />
                                        <label className='p-2' htmlFor={option}>{option}</label>
                                    </div>
                                ))}
                            </div>

                            <hr />
                            <h5>Species</h5>
                            <div className='row d-flex justify-content-evenly'>
                                {props.species.map((option, index) => (
                                    <div key={index} className='col-4'>
                                        <input
                                            type="checkbox"
                                            id={option}
                                            value={option}
                                            checked={selectedSpecies.includes(option)}
                                            onChange={handleSpecieChange}
                                        />
                                        <label className='p-2' htmlFor={option}>{option}</label>
                                    </div>
                                ))}
                            </div>

                        </div >
                        <div className="modal-footer">
                            {/* < button type="button" className="btn btn-secondary" ref={closeModal} data-bs-dismiss="modal" onClick={() => setShowModel(false)}>Close</button> */}
                            < button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={ApplyFilter}>Apply</button>
                        </div >
                    </div >
                </div >
            </div >
        </>
    )
}
