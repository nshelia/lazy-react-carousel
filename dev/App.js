import React, { useRef } from "react"
import Carousel from "../src/Carousel"
import leftArrow from "assets/left-arrow.svg"
import rightArrow from "assets/right-arrow.svg"
import { hot } from 'react-hot-loader/root'


function Application() {
	const ref = useRef()
	
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
				<h1>Lazy React Carousel </h1>
				<button onClick={() => ref.current.scrollToSlide(1)}>go to slide 1</button>
				<button onClick={() => ref.current.scrollToSlide(2)}>go to slide 2</button>
				<button onClick={() => ref.current.scrollToSlide(3)}>go to slide 3</button>
				<button onClick={() => ref.current.scrollToSlide(4)}>go to slide 4</button>
				<button onClick={() => ref.current.scrollToSlide(5)}>go to slide 5</button>
				<div className="col-8">
					<Carousel
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