import React, { useImperativeHandle, forwardRef, useRef, useState, useEffect } from "react"
import './sass/carousel.scss';

const Carousel = forwardRef((props,ref) => {
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
		scrollToSlide(currentSlidePosition + 1)
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
			scrollToSlide(currentSlidePosition - 1)
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
		if (currentSlideCount >= slide) {
			if (slide === currentSlidePosition) {
				return
			}
      
			if (currentSlidePosition > slide) {
				scrollToLeft(slide)
			} else {
				scrollToRight(slide)
			}

			setCurrentSlidePosition(slide)
		} else {
			return new Error("Slide number must be greater than slides count")
		}
	}

	useImperativeHandle(ref, () => ({
		scrollToSlide,
		next,
		prev,
		currentSlideCount,
		currentSlidePosition
	}))

	useEffect(() => {

		setCurrentSlideCount(calculateSlideCount())

		const newItemWidth = getSliderWrapperWidth() / props.itemsPerSlide || itemWidth
		setItemWidth(newItemWidth)
    
		const arrowsNeeded = props.children.length * newItemWidth > getSliderWrapperWidth()

		setPrevArrowVisibility(arrowsNeeded ? true : false)
		setNextArrowVisibility(arrowsNeeded ? true : false)

	},[getSliderWrapperWidth(),props.itemsPerSlide,props.children.length])

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
					<div 
						className="carousel-arrow-wrapper"
						style={
							{"display": nextArrowVisible ? "block" : "none"}
						}
						onClick={next}
					>
						{props.nextArrow ? <props.nextArrow /> : <button>Next</button>}
					</div>
					<div 
						className="carousel-arrow-wrapper"
						style={
							{"display": prevArrowVisible ? "block" : "none"}
						}
						onClick={prev}
					>
						{props.prevArrow ? <props.prevArrow /> : <button>Prev</button>}
					</div>
				</React.Fragment>
			)
		}
		return null
	}

	const renderCounter = () => {
		if (props.showCounter) {
			return <span className="carousel-counter">{currentSlidePosition} / {currentSlideCount}</span>
		}
		return null
	}

	return (
		<React.Fragment>
			<div style={{"display": "flex","alignItems": "center","flexDirection": "column"}}>
				{renderCounter()}
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
})

Carousel.defaultProps = {
	itemsPerSlide: 1,
	itemsToScroll: 1,
	showArrows: true,
	showCounter: true
}

export default Carousel