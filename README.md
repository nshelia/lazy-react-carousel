# Lazy React Carousel :tada:
[![npm version](https://img.shields.io/npm/v/lazy-react-carousel.svg?style=flat)](https://www.npmjs.com/package/lazy-react-carousel)

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

### Public Methods

##### scrollToSlide ({slide: number})

Forcefully scroll to custom slide number

##### next ()

Scrolls to next slide

##### prev ()

Scrolls to prev slide

#### Can be used to implement custom arrows outside of the carousel component 
