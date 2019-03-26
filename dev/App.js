import React, { useRef, useEffect, useState } from "react"
import Carousel from "../src/Carousel"
import leftArrow from "assets/left-arrow.svg"
import rightArrow from "assets/right-arrow.svg"
import { hot } from 'react-hot-loader/root'
import Button from '@material-ui/core/Button';

function Application() {

	const [posters, setPosters] = useState([])

	const fetchMoviePosters = async () => {
		const response = await fetch("https://api.themoviedb.org/3/trending/all/day?api_key=ddf7ff490ee23119bd3ce41d3c4ce19d")

		response.json().then((data) => {
      const posters = data.results.map(movie => {
      	return `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
      });
      setPosters(posters)
    });
	}

	useEffect(() => {
		fetchMoviePosters()
		return () => setPosters([])
	},[])

	const ref = useRef()
	
	const renderList = () => {
		return posters.map((url,index) => {
			return (
				<div className="slide-wrapper" key={index}>
					<img src={url}/>
				</div>
			)
		}) 	
	}

	const nextArrow = ({visible}) => {
		return (
			(
				<div className="carousel-arrow carousel-method">
						<Button variant="contained" color="secondary" disabled={!visible}>Next</Button>
				</div>
			)
		)	
	}

	const prevArrow = ({visible}) => {

		return (
			<div className="carousel-arrow carousel-method">
				<Button variant="contained" color="secondary" disabled={!visible}>prev</Button>
			</div>
		)
	}


	return (
		<div className="container">
			<div className="carousel-app">
				<h1>Lazy React Carousel </h1>
				<h4>Light-weight and customizable horizontal carousel for React apps :)</h4>
				<div className="carousel-methods">
					<Button variant="contained" color="primary" onClick={() => ref.current.scrollToSlide(1)}>go to slide 1</Button>
					<Button variant="contained" color="primary" onClick={() => ref.current.scrollToSlide(2)}>go to slide 2</Button>
					<Button variant="contained" color="primary" onClick={() => ref.current.scrollToSlide(3)}>go to slide 3</Button>
					<Button variant="contained" color="primary" onClick={() => ref.current.scrollToSlide(4)}>go to slide 4</Button>
					<Button variant="contained" color="primary" onClick={() => ref.current.scrollToSlide(5)}>go to slide 5</Button>
				</div>
				
				<div className="col-12">
					<Carousel
						scrollDuration={200}
						itemsPerSlide={3}
						nextArrow={nextArrow}
						prevArrow={prevArrow}
						ref={ref}
					>
						{renderList()}
					</Carousel>
				</div>
			</div>
		</div>
	)
}

export default hot(Application)