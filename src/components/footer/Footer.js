import React from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopyright } from '@fortawesome/free-solid-svg-icons'
import './Footer.css'

class Footer extends React.Component {
	render() {
		let x = new Date().getFullYear()
		return (
			<footer id="footer" className="container">
				<div className="row justify-content-center">
					<div className="col-12 text-center">
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