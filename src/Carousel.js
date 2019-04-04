// @flow

import React, { memo, useImperativeHandle, forwardRef, useRef, useState, useEffect, useLayoutEffect } from "react"
import type { Node } from "react"

type Props = {
  lazy: boolean,
  scrollDuration: 500,
  children: Array<Node>,
  prevArrow?: (params: {visible: bool}) => Node,
  nextArrow?: (params: {visible: bool}) => Node,
  itemsPerSlide: number,
  itemsToScroll: number,
  showArrows?: boolean
};

type RefObject = {
  current: null | ?HTMLDivElement
}

const Carousel = memo(forwardRef<Props>(({
  lazy = true,
  scrollDuration = 500,  
  itemsPerSlide = 1,
  itemsToScroll = 1,
  showArrows = true,
  children,
  nextArrow,
  prevArrow,
},ref) => {

  const carouselWrapper: RefObject = useRef()
  const sliderAnimator: RefObject = useRef()
  const [itemWidth, setItemWidth] = useState(0)
  const [nextArrowVisible, setNextArrowVisibility] = useState(true)
  const [prevArrowVisible, setPrevArrowVisibility] = useState(false)
  const [initialXPosition, setInitialXPosition] = useState(0)
  const [currentSlidePosition, setCurrentSlidePosition] = useState(1)
  const [scrolledSlides,setScrolledSlides] = useState(1)

  const scrollToRight = (slide: number) => {
    const remainSlides: number = slide - currentSlidePosition

    let nextPosition: number = initialXPosition - (itemWidth * itemsToScroll * remainSlides) 
    const remainWidthBeforeLastItem: number = getSliderAnimatorWidth() + nextPosition - getCarouselWrapperWidth()

    if (remainWidthBeforeLastItem < itemWidth) {
      nextPosition -= remainWidthBeforeLastItem
      setNextArrowVisibility(false)
    }

    setTranslate(nextPosition)
    setInitialXPosition(nextPosition)
    setPrevArrowVisibility(true)

  }

  useLayoutEffect(() => {
    setItemWidth(getCarouselWrapperWidth() / itemsPerSlide)
  },[itemsPerSlide])

  const next = () => {
    scrollToSlide(currentSlidePosition + 1)
  }

  const scrollToLeft = (slide: number) => {
    const remainSlides: number = currentSlidePosition - slide

    let nextPosition: number = initialXPosition + (itemWidth * itemsToScroll * remainSlides) 
    const absNextPosition: number = Math.abs(nextPosition) 
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

  const getSliderAnimatorWidth = () => {
    return React.Children.toArray(children).length * itemWidth
  }

  const getCarouselWrapperWidth = () => {
    if (carouselWrapper.current) {
      return carouselWrapper.current.offsetWidth
    }
    return 0
  }



  const setTranslate = (xPos: number) =>  {
    const sliderAnimatorRef: null | ?HTMLDivElement = sliderAnimator.current
    if (sliderAnimatorRef) {
      sliderAnimatorRef.style.transform = `translate3d(${xPos}px, 0px, 0)`
    }
  }

  const scrollToSlide = (slide: number) => {
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

  useImperativeHandle(ref, () => ({
    scrollToSlide,
    next,
    prev,
    currentSlidePosition
  }))

  useEffect(() => {

    if (currentSlidePosition > scrolledSlides) {
      setScrolledSlides(currentSlidePosition)
    }

  },[currentSlidePosition])

  const renderList = () => {
    const carouselChildren = React.Children.toArray(children)

    if (itemWidth && carouselChildren.length) {
      let result

      if (lazy) {
        let visibleItemsCount = itemsPerSlide + (scrolledSlides * itemsToScroll) - itemsToScroll

        let notVisibleItemsCount = carouselChildren.length - visibleItemsCount

        const visibleComponents = carouselChildren.slice(0,visibleItemsCount)
        const virtualizedItems = Array(notVisibleItemsCount > 0 ? notVisibleItemsCount : 0 ).fill(null)

        if (notVisibleItemsCount > 0) {
          result = visibleComponents.concat(virtualizedItems)
        } else {
          result = visibleComponents 
        }
      } else {
        result = carouselChildren
      }

      return result.map((item,index) => {
        return (
          <div 
            key={index}
            className="carousel-item"
            style={{width: `${itemWidth}px`}} 
          > 
            {item && <item.type {...item.props} />}
          </div>
        )
      })
    }
    return null
  }

  const renderArrows = () => {
    if (showArrows) {
      const PrevArrow = prevArrow  
      const NextArrow = nextArrow  

      return (
        <React.Fragment>
          <div 
            className="carousel-arrow-wrapper"
            onClick={prev}
          >
            {PrevArrow ? <PrevArrow visible={prevArrowVisible} /> : <button>Prev</button> }
          </div>
          <div 
            className="carousel-arrow-wrapper"
            onClick={next}
          >
            { NextArrow ? <NextArrow visible={nextArrowVisible} /> : <button>Next</button> }
          </div>
        </React.Fragment>
      )
    }
    return null
  }

  return (
    <React.Fragment>
      <div className="carousel-wrapper" ref={carouselWrapper}>
        <div className="carousel-slides-wrapper">
          <div className="carousel-animator" 
            style={{
              "will-change": "transform",
              "width": `${getSliderAnimatorWidth()}px`,
              "transition": `transform ${scrollDuration / 1000}s`
            }} 
            ref={sliderAnimator}>
            {renderList()}
          </div>
        </div>
        <div className="carousel-arrows">
          {renderArrows()}
        </div>
      </div>
    </React.Fragment>
  )
}))



export default Carousel