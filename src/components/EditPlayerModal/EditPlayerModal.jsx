import React from "react";

function EditPlayerModal(props) {
	return (
		<div
			className="modal fade"
			id="editPlayer"
			data-backdrop="static"
			data-keyboard="false"
			tabIndex="-1"
			aria-labelledby="staticBackdropLabel"
			aria-hidden="true"
		>
			<div className="modal-dialog modal-dialog-scrollable">
				<div className="modal-content">
					<div className="modal-header">
						<h2 className="modal-title " id="staticBackdropLabel">
							Edit Player
						</h2>
						<button
							id="closeModal"
							type="button"
							className="close"
							data-dismiss="modal"
							aria-label="Close"
							onClick={() => {
								props.setError("");
								props.resetPlayer();
							}}
						>
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div className="modal-body">
						<div className="container">
							<div id="form" className="row justify-content-center">
								{props.form}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default EditPlayerModal;
