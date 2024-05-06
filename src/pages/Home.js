import React, { useEffect, useState } from "react";
import Axios from "axios";
import styled, { keyframes } from "styled-components";
import CharacterCard from "../components/CharacterCard";
import "./Home.css"
import Header from "../components/Header";
import FilterModal from "../components/FilterModal";

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;
const SwapiContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 30px;
  gap: 25px;
  justify-content: space-evenly;;
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Placeholder = styled.img`
  width: 120px;
  height: 120px;
  margin-top: 25vh;
  opacity: 80%;
  animation: ${rotate} 4s linear infinite; 
  z-index: -1!important;
`;

function Home(props) {

    const [searchQuery, updateSearchQuery] = useState("");
    const [loadMore, updateLoadMore] = useState(false);
    const [page, setPage] = useState(1);
    const [CharacterList, setCharacterList] = useState([]);
    const [FilteredCharacterList, setFilteredCharacterList] = useState([]);
    const [error, updateError] = useState(null);
    const [timeoutId, updateTimeoutId] = useState();
    const [isScrollBtnVisible, setIsScrollBtnVisible] = useState(false);
    const [planets, setPlanets] = useState([]);
    const [films, setFilms] = useState([]);
    const [species, setSpecies] = useState([]);
    const [selectedPlanets, setSelectedPlanets] = useState([]);
    const [selectedFilms, setSelectedFilms] = useState([]);
    const [selectedSpecies, setSelectedSpecies] = useState([]);
    const [showFilterModel, setShowFilterModel] = useState(false);

    // Function to filter unique items based on ID
    const filterUniqueItems = (apiResponse) => {
        const uniqueIds = new Set(); // Set to track unique IDs
        return apiResponse.filter(item => {
            if (!uniqueIds.has(item.created)) {
                uniqueIds.add(item.created); // Add ID to set
                return true; // Keep the item in the filtered array
            }
            return false; // Discard the item
        });
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Smooth scrolling behavior
        });
    };

    // Function to handle scroll event and toggle visibility of the up arrow
    const handleScroll = () => {
        const scrollTop = window.pageYOffset;

        if (scrollTop > 300) { // Adjust this threshold as needed
            setIsScrollBtnVisible(true);
        } else {
            setIsScrollBtnVisible(false);
        }
    };

    // Function to filter data based on selected filters
    const filterData = (data) => {

        if (selectedPlanets.length === 0 && selectedFilms.length === 0 && selectedSpecies.length === 0) {
            return data;
        }

        let filteredData = data;

        // Home world filter
        if (selectedPlanets.length !== 0) {
            filteredData = data.filter(item =>
                selectedPlanets.includes(item.homeworlddata.name)
            );
        }
        // Films filter
        if (selectedFilms.length !== 0) {
            filteredData = data.filter(item =>
                item.filmdata.some(film => selectedFilms.includes(film.title))
            );
        }
        // Species filter
        if (selectedSpecies.length !== 0) {
            filteredData = data.filter(item =>
                selectedSpecies.includes(item.speciesdata.name)
            );
        }

        return filteredData;

    };

    const fetchData = async (searchString) => {

        if (selectedPlanets.length !== 0 || selectedFilms.length !== 0 || selectedSpecies.length !== 0) {
            if (page === 1) {
                //if flter is selected then reset the character list
                setCharacterList([]);
            }
        }

        const pageSize = 10;
        try {
            let response;

            if (searchString === "") {

                const uniquePlanets = planets;
                const uniqueFilms = films;
                const uniqueSpecies = species;

                response = await Axios.get(`${process.env.REACT_APP_SWAPI_BASE}/people?page=${page}&&limit=${pageSize}`);
                let chars = await response.data.results;

                response = await Axios.get(`${process.env.REACT_APP_PICSUM_BASE}/v2/list?page=${page}&limit=${pageSize}`)
                let imgs = await response.data;

                const charlist = await Promise.all(chars.map(async (char, index) => {
                    const img = imgs[index];

                    let homedata = await Axios.get(char.homeworld);

                    uniquePlanets.push(homedata.data.name);



                    let filmdata = await Promise.all(char.films.map(async (film) => {
                        let filmresponse = await Axios.get(film);

                        uniqueFilms.push(filmresponse.data.title);

                        return filmresponse.data;
                    }));

                    let speciesdata = { data: {} };
                    if (char.species.length > 0) {
                        speciesdata = await Axios.get(char.species[0]);

                        uniqueSpecies.push(speciesdata.data.name);

                    }
                    // Merge properties of objects at the same index
                    return { ...char, image: img.download_url, homeworlddata: homedata.data, filmdata, speciesdata: speciesdata.data };
                }));

                chars = filterUniqueItems(CharacterList.concat(charlist))

                setPlanets([...new Set(uniquePlanets)]);
                setFilms([...new Set(uniqueFilms)]);
                setSpecies([...new Set(uniqueSpecies)]);

                if (!(selectedPlanets.length === 0 && selectedFilms.length === 0 && selectedSpecies.length === 0)) {
                    let list = FilteredCharacterList;
                    setFilteredCharacterList([]);
                    chars = filterData(list.concat(chars));
                    chars = filterUniqueItems(chars);
                    setFilteredCharacterList(chars);
                    updateLoadMore(false);
                    return;
                }

                setCharacterList(chars);
                // console.log(chars);

            } else {

                const uniquePlanets = planets;
                const uniqueFilms = films;
                const uniqueSpecies = species;

                setCharacterList([]);
                response = await Axios.get(`${process.env.REACT_APP_SWAPI_BASE}/people?search=${searchString}`);
                let chars = await response.data.results;

                response = await Axios.get(`${process.env.REACT_APP_PICSUM_BASE}/v2/list?page=${page}&limit=${pageSize}`)
                let imgs = await response.data;

                const charlist = await Promise.all(chars.map(async (char, index) => {
                    const img = imgs[index];

                    let homedata = await Axios.get(char.homeworld);

                    uniquePlanets.push(homedata.data.name);

                    let filmdata = await Promise.all(char.films.map(async (film) => {
                        let filmresponse = await Axios.get(film);

                        uniqueFilms.push(filmresponse.data.title);

                        return filmresponse.data;
                    }));

                    let speciesdata = { data: {} };
                    if (char.species.length > 0) {
                        speciesdata = await Axios.get(char.species[0]);

                        uniqueSpecies.push(speciesdata.data.name);
                    }
                    // Merge properties of objects at the same index
                    return { ...char, image: img.download_url, homeworlddata: homedata.data, filmdata, speciesdata: speciesdata.data };
                }));

                setPlanets([...new Set(uniquePlanets)]);
                setFilms([...new Set(uniqueFilms)]);
                setSpecies([...new Set(uniqueSpecies)]);

                if (!(selectedPlanets.length === 0 && selectedFilms.length === 0 && selectedSpecies.length === 0)) {
                    setFilteredCharacterList([]);
                    chars = filterData(charlist);
                    chars = filterUniqueItems(chars);
                    if (chars.length === 0) {
                        setFilteredCharacterList([]);
                        throw new Error("No results found");
                    }
                    updateError(null);
                    setFilteredCharacterList(chars);
                    updateLoadMore(false);
                    return;
                }

                if (chars.length === 0) {
                    setFilteredCharacterList([]);
                    throw new Error("No results found");
                }
                updateError(null);
                setFilteredCharacterList(charlist);
                // console.log(charlist);
            }
            updateLoadMore(false);
        }
        catch (error) {
            updateError(error.message);
            updateLoadMore(false);
        }

    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        if (selectedPlanets.length === 0 && selectedFilms.length === 0 && selectedSpecies.length === 0) {
            setFilteredCharacterList([]);

            setCharacterList([]);
        }
        else {
            setCharacterList([]);
            setFilteredCharacterList([]);

        }
        fetchData("");

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };

        // eslint-disable-next-line
    }, [selectedPlanets, selectedFilms, selectedSpecies]);

    useEffect(() => {

        window.addEventListener('scroll', handleScroll);
        fetchData("");

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };

        // eslint-disable-next-line
    }, [page]);

    const clearSearch = () => {
        updateSearchQuery("");
        setFilteredCharacterList([]);
        fetchData("");
    }

    const onTextChange = (e) => {
        clearTimeout(timeoutId);
        updateSearchQuery(e.target.value);
        setFilteredCharacterList([]);
        if (e.target.value !== "") {
            const timeout = setTimeout(() => fetchData(e.target.value), 100);
            updateTimeoutId(timeout);
            return () => clearTimeout(timeout);
        } else {
            fetchData("");
        }
    };
    return (
        <Container>

            <Header setLoggedIn={props.setLoggedIn} showSearch={true} category={true} searchQuery={searchQuery} onTextChange={onTextChange} clearSearch={clearSearch} />

            {(CharacterList.length > 0 || FilteredCharacterList.length > 0) &&
                <div className={`filter-icon ${isScrollBtnVisible ? 'up' : ''}`} onClick={() => setShowFilterModel(true)}>
                    <img src="/images/filter.svg" alt="menu" />
                </div>
            }

            <div className={`floating-arrow ${isScrollBtnVisible ? 'visible' : ''}`} onClick={scrollToTop}>
                <img src="/images/up.svg" alt="menu" />
            </div>
            <FilterModal
                showFilterModel={showFilterModel}
                setShowFilterModel={setShowFilterModel}
                planets={planets}
                films={films}
                species={species}
                setSelectedPlanets={setSelectedPlanets}
                setSelectedFilms={setSelectedFilms}
                setSelectedSpecies={setSelectedSpecies}
            />

            {FilteredCharacterList?.length > 0 ?
                <SwapiContainer className="rcontainer" >
                    {FilteredCharacterList?.length ?
                        FilteredCharacterList.map((Character, index) => (
                            <CharacterCard
                                key={Character.created}
                                Character={Character}
                            />
                        )) : <Placeholder src={"images/loading_logo.png"} />}
                </SwapiContainer>
                :
                <SwapiContainer className="rcontainer" >
                    {CharacterList?.length ?
                        CharacterList.map((Character, index) => (
                            <CharacterCard
                                key={Character.created}
                                Character={Character}
                            />
                        )) : <Placeholder src={"images/loading_logo.png"} />}
                </SwapiContainer>
            }

            {error && <div className="alert alert-danger w-auto m-auto text-center" role="alert">{error}</div>}
            {loadMore && <img className="m-auto" style={{ position: "relative", bottom: "70px" }} src="images/loading.gif" alt="Loading..." height={"140px"} width={"140px"}></img>}

            {(CharacterList.length !== 0 && searchQuery === "") && <button className="btn m-auto mb-3 loadbtn" onClick={() => { setPage(pageCnt => pageCnt + 1); updateLoadMore(true); }} style={{ width: "auto" }}>Load More</button>}
            {(FilteredCharacterList.length !== 0 && searchQuery === "") && <button className="btn m-auto mb-3 loadbtn" onClick={() => { setPage(pageCnt => pageCnt + 1); updateLoadMore(true); }} style={{ width: "auto" }}>Load More</button>}

        </Container>
    );
}

export default Home;