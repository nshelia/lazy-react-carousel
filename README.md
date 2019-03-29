# Lazy React Carousel :tada:

Light-weight and customizable horizontal carousel for React apps :fire:

[![npm version](https://img.shields.io/npm/v/lazy-react-carousel.svg?style=flat)](https://www.npmjs.com/package/lazy-react-carousel)


### Getting started
---------------

Install using npm/yarn

```shell
npm install lazy-react-carousel --save
```

### Usage

Add base styles to slider (Might be removed in future versions, instead add directly from slider component)

```bash
@import "~lazy-react-carousel/dist/index.css";
```


### Prop Types
| Property | Type | Default | Description |
|:---|:---|:---:|:---|
| itemsPerSlide | Number | 1 | Number of items visible in one slide |
| itemsToScroll | Number | 1 | Number of items to scroll on navigation |
| showArrows | Boolean | true | Hide/Show default arrow components|
| showCounter | Boolean | true | Hide/Show default counter component |
| nextArrow | Node | Button | Show custom right arrow component |
| prevArrow | Node | Button | Show custom left arrow component |
| scrollDuration | Number | 500 | Scrolling animation time in milliseconds |
| lazy | Boolean | true | Lazy load items when navigating  |

### Public Methods

##### scrollToSlide ({slide: number})

Forcefully scroll to custom slide number

##### next ()

Scrolls to next slide

##### prev ()

Scrolls to prev slide

#### Can be used to implement custom arrows outside of the carousel component 

#### Example

```jsx
import React, { useRef } from 'react'
import Carousel from "lazy-react-carousel"

function LazyCarousel() {
  const ref = useRef()			
        
  const renderList () => {
  	// Some array of nodes
  }
    
  return (
    <React.Fragment>
        <Carousel
          ref={ref}
        >
            {renderList()}
        </Carousel>
        <button onClick={() => ref.current.next()}>Next</button>
        <button onClick={() => ref.current.prev()}>Prev</button>
    </React.Fragment>
  )
}
```