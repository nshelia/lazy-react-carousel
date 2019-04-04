// @flow

import React, { useImperativeHandle, forwardRef, useRef, useState, useEffect } from "react"
import type { Node, ChildrenArray, Element } from "react"
import useResizeObserver from "./helpers/use-resize-observer"

type Props = {
  lazy: boolean,
  scrollDuration: 500,
  children: Array<Node>,
  prevArrow?: (params: {visible: bool}) => Node,
  nextArrow?: (params: {visible: bool}) => Node,
  itemsPerSlide: number,
  itemsToScroll: number,
  showArrows?: boolean,
  showCounter?: boolean
};

type Methods = {

}

type RefObject = {
  current: null | ?HTMLDivElement
}

const Carousel = forwardRef<
  Props,
  Methods
  >(({
    lazy = true,
    scrollDuration = 500,  
    itemsPerSlide = 1,
    itemsToScroll = 1,
    showArrows = true,
    showCounter = true,
    children,
    nextArrow,
    prevArrow,
  },ref) => {

    const sliderWrapper: RefObject = useRef()
    const sliderAnimator: RefObject = useRef()

    const [itemWidth, setItemWidth] = useState(0)
    const [nextArrowVisible, setNextArrowVisibility] = useState(true)
    const [prevArrowVisible, setPrevArrowVisibility] = useState(false)
    const [initialXPosition, setInitialXPosition] = useState(0)
    const [currentSlidePosition, setCurrentSlidePosition] = useState(1)
    const [currentSlideCount, setCurrentSlideCount] = useState(0)
    const [resizeRef,resizedCarouselWrapperWidth] = useResizeObserver()
    const [scrolledSlides,setScrolledSlides] = useState(1)

    const scrollToRight = (slide: number) => {
      const remainSlides: number = slide - currentSlidePosition

      let nextPosition: number = initialXPosition - (itemWidth * itemsToScroll * remainSlides) 
      const remainWidthBeforeLastItem: number = getSliderAnimatorWidth() + nextPosition - resizedCarouselWrapperWidth

      if (remainWidthBeforeLastItem < itemWidth) {
        nextPosition -= remainWidthBeforeLastItem
        setNextArrowVisibility(false)
      }

      setTranslate(nextPosition)
      setInitialXPosition(nextPosition)
      setPrevArrowVisibility(true)

    }

    const calculateSlideCount = () => {
      const sliderWrapperWidth: number = resizedCarouselWrapperWidth
      const remainTrackWidth: number = getSliderAnimatorWidth() - sliderWrapperWidth 

      let simulated: boolean = false
      let slides: number = 1
      let initialXPosition: number = 0
  
      if (sliderWrapperWidth && remainTrackWidth) {
        if (children.length * itemWidth <= sliderWrapperWidth) {
          return slides
        }
        while (!simulated) {
          let nextPosition: number = initialXPosition - (itemWidth * itemsToScroll) 
          initialXPosition = nextPosition
          const remainWidthBeforeLastItem: number = remainTrackWidth + nextPosition

          if (remainWidthBeforeLastItem < itemWidth) {
            simulated = true
          }
          slides++
        }
        return slides
      } else {
        return 0
      }
    }

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
      if (sliderAnimator.current) {
        return sliderAnimator.current.offsetWidth
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
        return console.error("Slide number must be greater than slides count")
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

      if (currentSlidePosition > scrolledSlides) {
        setScrolledSlides(currentSlidePosition)
      }

    },[currentSlidePosition])
 
    useEffect(() => {
      const slideCount = calculateSlideCount()

      setCurrentSlideCount(slideCount)
    })

    useEffect(() => {
      if (resizedCarouselWrapperWidth) {

        const newItemWidth: number = resizedCarouselWrapperWidth / itemsPerSlide || itemWidth
        setItemWidth(newItemWidth)
        
        const arrowsNeeded: boolean = children.length * newItemWidth > resizedCarouselWrapperWidth

        setNextArrowVisibility(arrowsNeeded)
      }

    },[itemsPerSlide,children.length,resizedCarouselWrapperWidth])


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
          if (item) {
            return (
              <div 
                key={index}
                className="carousel-item"
                style={{width: `${itemWidth}px`}} 
              > 
                <item.type {...item.props} />
              </div>
            )
          } else {
            return (
              <div 
                key={index}
                className="carousel-item"
                style={{width: `${itemWidth}px`}} 
              /> 
            ) 
          }
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

    const renderCounter = () => {
      if (showCounter) {
        return (
          <span className="carousel-counter">
            {currentSlidePosition} / {currentSlideCount}
          </span>
        )
      
      }
      return null
    }

    return (
      <React.Fragment>
        <div className="carousel-counter">
          {renderCounter()}
        </div>
        <div className="carousel-wrapper" ref={resizeRef}>
          <div className="carousel-slides-wrapper" ref={sliderWrapper}>
            <div className="carousel-animator" style={{ "transition": `transform ${scrollDuration / 1000}s`}} ref={sliderAnimator}>
              {renderList()}
            </div>
          </div>
          <div className="carousel-arrows">
            {renderArrows()}
          </div>
        </div>
      </React.Fragment>
    )
  })



export default Carousel