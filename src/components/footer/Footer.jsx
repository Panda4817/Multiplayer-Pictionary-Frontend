import React from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopyright } from '@fortawesome/free-solid-svg-icons'
import './Footer.css'

// Footer component rendered on each page
class Footer extends React.Component {
	render() {
		let x = new Date().getFullYear()
		return (
			<footer id="footer" className="container">
				<div className="row justify-content-center">
					<div className="col-12 text-center">
						<a href="https://www.buymeacoffee.com/kmunton" target="_blank">
							<img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style={{height: '50px'}} />
						</a>
						<p id="footer_text">
							Created by KMunton<br />
							<FontAwesomeIcon icon={faCopyright} /> {x}
						</p>
					</div>
				</div>
			</footer>
		)
	}
}


export default Footer