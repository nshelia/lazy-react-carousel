import React, { useRef, useState, useEffect } from "react"

export default function Carousel(props) {
	const sliderWrapper = useRef()
	const sliderAnimator = useRef()

	const [itemWidth, setItemWidth] = useState(0)
	const [nextArrowVisible, setNextArrowVisibility] = useState(true)
	const [prevArrowVisible, setPrevArrowVisibility] = useState(false)
	const [initialXPosition, setInitialXPosition] = useState(0)
	const [currentSlidePosition, setCurrentSlidePosition] = useState(1)
	const [currentSlideCount, setCurrentSlideCount] = useState(0)

	const scrollToRight = (slide) => {
		const remainSlides = slide - currentSlidePosition

		const sliderAnimatorRef = sliderAnimator.current
		let nextPosition = initialXPosition - (itemWidth * props.itemsToScroll * remainSlides) 
		const remainWidthBeforeLastItem = sliderAnimatorRef.offsetWidth + nextPosition - getSliderWrapperWidth()

		if (remainWidthBeforeLastItem < itemWidth) {
			nextPosition -= remainWidthBeforeLastItem
			setNextArrowVisibility(false)
		}

		setTranslate(nextPosition)
		setInitialXPosition(nextPosition)
		setPrevArrowVisibility(true)

	}

	const calculateSlideCount = () => {
		if (sliderWrapper.current && sliderAnimator.current) { 
			let calculated = false
			let slides = 1
			let initialXPosition = 0
			if (props.children.length * itemWidth <= getSliderWrapperWidth()) {
				return slides
			}
			while (!calculated) {
				let nextPosition = initialXPosition - (itemWidth * props.itemsToScroll) 
				initialXPosition = nextPosition
				const remainWidthBeforeLastItem = getSliderAnimatorWidth() + nextPosition - getSliderWrapperWidth()
				if (remainWidthBeforeLastItem < itemWidth) {
					nextPosition -= remainWidthBeforeLastItem
					calculated = true
				}
				slides++
			}
			return slides
		}
	}

	const next = () => {
		scrollToRight(currentSlidePosition + 1)
		setCurrentSlidePosition(currentSlidePosition + 1)
	}

	const scrollToLeft = (slide) => {
		const remainSlides = currentSlidePosition - slide

		let nextPosition = initialXPosition + (itemWidth * props.itemsToScroll * remainSlides) 
		const absNextPosition = Math.abs(nextPosition) 
		if (nextPosition === absNextPosition) {
			nextPosition = 0
		}
    
		setTranslate(nextPosition)
		setInitialXPosition(nextPosition)
		setNextArrowVisibility(true)
		setPrevArrowVisibility(nextPosition !== 0)
	}

	const prev = () => {
		if (initialXPosition < 0) {
			scrollToLeft(currentSlidePosition - 1)
			setCurrentSlidePosition(currentSlidePosition - 1)
		}
	}
  
	const getSliderWrapperWidth = () => {
		if (sliderWrapper.current) {
			return sliderWrapper.current.clientWidth
		}
	}

	const getSliderAnimatorWidth = () => {
		if (sliderAnimator.current) {
			return sliderAnimator.current.offsetWidth
		}
	}

	const setTranslate = (xPos) =>  {
		const sliderAnimatorRef = sliderAnimator.current
		sliderAnimatorRef.style.transform = `translate3d(${xPos}px, 0px, 0)`
	}

	const scrollToSlide = (slide) => {
    
		if (slide === currentSlidePosition) {
			return
		}
		
		if (currentSlidePosition > slide) {
			scrollToLeft(slide)
		} else {
			scrollToRight(slide)
		}

		setCurrentSlidePosition(slide)
	}

	useEffect(() => {
		if (itemWidth) {
			scrollToSlide(props.currentSlide)
		}
	},[props.currentSlide,itemWidth])

	useEffect(() => {

		setCurrentSlideCount(calculateSlideCount())

		const newItemWidth = getSliderWrapperWidth() / props.itemsPerSlide || itemWidth
		setItemWidth(newItemWidth)
		
		if (props.children.length * newItemWidth <= getSliderWrapperWidth()) {
			setPrevArrowVisibility(false)
			setNextArrowVisibility(false)
		}
	},[getSliderWrapperWidth(),props.itemsPerSlide])

	const renderList = () => {
		if (itemWidth) {
			return React.Children.map(props.children, (item,index) => {
				return (
					<div 
						key={index}
						className="carousel-item"
						style={{width: `${itemWidth}px`}} 
					> 
						<item.type {...item.props} />
					</div>
				)
			})
		}
		return null
	}

	const renderArrows = () => {
		if (props.showArrows) {
			return (
				<React.Fragment>
					<button 
						className="carousel-arrow-wrapper"
						style={
							{"display": nextArrowVisible ? "block" : "none"}
						}
						onClick={next}
					>
						<props.nextArrow />
					</button>
					<button 
						className="carousel-arrow-wrapper"
						style={
							{"display": prevArrowVisible ? "block" : "none"}
						}
						onClick={prev}
					>
						<props.prevArrow />
					</button>
				</React.Fragment>
			)
		}
		return null
	}

	return (
		<React.Fragment>
			<div style={{"display": "flex","alignItems": "center","flexDirection": "column"}}>
				<h1>{currentSlidePosition} / {currentSlideCount}</h1>
			</div>
			<div className="carousel-wrapper">
				<div className="carousel-slides-wrapper" ref={sliderWrapper}>
					<div className="carousel-animator" ref={sliderAnimator}>
						{renderList()}
					</div>
				</div>
				{renderArrows()}
			</div>
		</React.Fragment>
	)
}

Carousel.defaultProps = {
	currentSlide: 1,
	itemsPerSlide: 1,
	itemsToScroll: 1,
	showArrows: true,
}