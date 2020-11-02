Ember provides a few ways to help developers more easily produce accessible applications, and this section of the guides will more explicitly assist with that. 

![Ember Loves Accessibility](/images/accessibility/index/a11y-mascots.png)

Accessibility should be considered at the start of a project, whether that project has named accessibility an explicit goal or not. Since no one can predict anyone else's future (including whether or not they will need assistive technology at some point), and because in many places around the world it is legally required to make websites digitally accessible, accessibility should be thought about in the same way as performance- a necessity for any web-based product. 

Additionally, it causes less churn to decide to implement basic accessibility considerations at the start of the project, than trying to add it on later or pivoting mid-project. Semantic HTML doesn't take any additional time to write than non-semantic markup, provides a lower cognitive burden for development, typically produces less markup which will help an application be more performant, and is better for SEO. 


## Accessibility Strategy

Digital accessibility regulations vary from country to country, but most at least point to the [WAI-ARIA](https://www.w3.org/WAI/) specification for compliance. 

"100% accessible"- what does that mean? From a practical perspective, accessibility really looks more like 90% coding to the spec and 10% filing browser bugs (or keeping track of existing browser bugs). Keep in mind that if a workaround for a browser bug is implemented, an internal tracking issue in the product backlog should be also filed so as to provide the reminder to follow up on browser bugs at a later date. 

Creating a sensible plan for your product up front can save a great deal of stress down the road. 
