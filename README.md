# Lazy React Carousel :tada:

### Prop Types
| Property | Type | Required? | Description |
|:---|:---|:---:|:---|
| itemsPerSlide | Number |  | Number of items visible in one slide |
| itemsToScroll | Number |  | Number of items to scroll on navigation |
| showArrows | Boolean |  | Hide/Show default arrow components|
| showCounter | Boolean |  | Hide/Show default counter component |
| nextArrow | React Node |  | Show custom right arrow component |
| prevArrow | React Node |  | Show custom left arrow component |
| scrollDuration | Number |  | Scrolling animation time in milliseconds |

### Public Methods

##### scrollToSlide ({slide: number})

Forcefully scroll to custom slide number

##### next ()

Scrolls to next slide

##### prev ()

Scrolls to prev slide

#### Can be used to implement custom arrows outside of the carousel component 
