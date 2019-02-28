import React, { useState } from "react"
import Carousel from "../src/Carousel"
import leftArrow from "assets/left-arrow.svg"
import rightArrow from "assets/right-arrow.svg"

export default function Application() {
		
	const [currentSlide,setCurrentSlide] = useState(1)

	const renderList = () => {
		return Array(10).fill(null).map((item,index) => {
			return (
				<div className="slide-wrapper" key={index}>
					<img src="http://placekitten.com/g/400/200"/>
				</div>
			)
		}) 	
	}

	const nextArrow = () => (
		<div className="carousel-arrow">
			<button>next</button>
		</div>
	)

	const prevArrow = () => (
		<div className="carousel-arrow">
			<button>prev</button>
		</div>
	)

	return (
		<div className="container">
			<div className="carousel-app">
				<h1>Lazy React Carousel</h1>
				<button onClick={() => setCurrentSlide(1)}>go to slide 1</button>
				<button onClick={() => setCurrentSlide(2)}>go to slide 2</button>
				<button onClick={() => setCurrentSlide(3)}>go to slide 3</button>
				<button onClick={() => setCurrentSlide(4)}>go to slide 4</button>
				<button onClick={() => setCurrentSlide(5)}>go to slide 5</button>
				<div className="col-8">
					<Carousel
						nextArrow={nextArrow}
						prevArrow={prevArrow}
						currentSlide={currentSlide}
					>
						{renderList()}
					</Carousel>
				</div>
			</div>
		</div>
	)
}