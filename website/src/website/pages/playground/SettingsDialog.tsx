import { computed } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
import { Button, ListGroup, Modal } from "../../components/bootstrap";
import { Radio } from "../../components/Radio";
import { Select } from "../../components/Select";
import { TextBox } from "../../components/TextBox";
import { ControlledMonacoEditor } from "../../components/monaco/MonacoEditor";
import { ref } from "../../utils/ref";
import { ObservablePromise } from "../../utils/ObservablePromise";
import { getNpmVersionsSync } from "./getNpmVersionsSync";
import { PlaygroundModel, SettingsDialogModel } from "./PlaygroundModel";
import { Horizontal, Vertical } from "./PlaygroundPageContent";
import { StabilityValues } from "./SettingsModel";

@observer
export class SettingsDialog extends React.Component<{
	model: PlaygroundModel;
}> {
	private lastSettingsDialogModel: SettingsDialogModel | undefined;

	private get settingsDialogModel() {
		return (
			this.props.model.settingsDialogModel || this.lastSettingsDialogModel
		);
	}

	@computed
	get npmVersions(): string[] {
		return getNpmVersionsSync(
			this.settingsDialogModel?.settings.npmVersion
		);
	}

	render() {
		const model = this.props.model;
		const modelSettings = this.settingsDialogModel;
		this.lastSettingsDialogModel = modelSettings;
		if (!modelSettings) {
			return null;
		}
		return (
			<Modal
				show={!!model.settingsDialogModel}
				onHide={() => model.closeSettingsDialog(false)}
				size="xl"
			>
				<Modal.Header closeButton>
					<Modal.Title>Settings</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<ListGroup>
						<ListGroup.Item>
							<div className="d-flex">
								<label className="d-flex gap-2">
									<Radio
										value={ref(
											modelSettings.settings,
											"monacoSource"
										)}
										current="latest"
									/>

									<span>
										Load Latest Monaco
										<small className="d-block text-muted">
											Loads the most recent version of
											Monaco bundled with this website.
										</small>
									</span>
								</label>
								<fieldset
									className="d-flex"
									style={{ marginLeft: "auto" }}
									disabled={
										modelSettings.settings.monacoSource !==
										"latest"
									}
								>
									<Select
										value={ref(
											modelSettings.settings,
											"latestStability"
										)}
										values={StabilityValues}
										getLabel={(v) => v}
										style={{ width: 100 }}
									/>
								</fieldset>
							</div>
						</ListGroup.Item>

						<ListGroup.Item>
							<div className="d-flex gap-2">
								<label className="d-flex gap-2">
									<Radio
										value={ref(
											modelSettings.settings,
											"monacoSource"
										)}
										current="npm"
									/>

									<span>
										Load Monaco From NPM
										<small className="d-block text-muted">
											Loads Monaco from{" "}
											<a href="https://www.jsdelivr.com/">
												jsdelivr.com
											</a>
											.
										</small>
									</span>
								</label>
								<fieldset
									style={{ marginLeft: "auto" }}
									disabled={
										modelSettings.settings.monacoSource !==
										"npm"
									}
									className="d-flex gap-2"
								>
									<Select
										value={ref(
											modelSettings.settings,
											"npmVersion"
										)}
										values={this.npmVersions}
										getLabel={(v) => v}
										style={{
											width: 150,
										}}
									/>
									<Select
										value={ref(
											modelSettings.settings,
											"npmStability"
										)}
										values={StabilityValues}
										getLabel={(v) => v}
										style={{
											width: 100,
										}}
									/>
								</fieldset>
							</div>
						</ListGroup.Item>

						<ListGroup.Item>
							<div className="d-flex gap-2">
								<Vertical>
									<Horizontal>
										<label className="d-flex gap-2">
											<Radio
												value={ref(
													modelSettings.settings,
													"monacoSource"
												)}
												current="independent"
											/>

											<span style={{ marginLeft: 8 }}>
												Load Monaco Core Independently
												<small className="d-block text-muted">
													Loads the Monaco editor core
													and the language
													contributions from different
													sources.
												</small>
											</span>
										</label>
									</Horizontal>
									<fieldset
										disabled={
											modelSettings.settings
												.monacoSource !== "independent"
										}
									>
										<ListGroup className="p-3">
											<ListGroup.Item>
												<div className="d-flex gap-2">
													<label className="d-flex gap-2">
														<Radio
															value={ref(
																modelSettings.settings,
																"coreSource"
															)}
															current="latest"
														/>
														<span>
															Load Latest Core
															<small className="d-block text-muted">
																Loads the
																version of
																Monaco editor
																core that is
																bundled with
																this website.
															</small>
														</span>
													</label>
													<Select
														value={ref(
															modelSettings.settings,
															"latestCoreStability"
														)}
														values={StabilityValues}
														getLabel={(v) => v}
														style={{
															width: 100,
															marginLeft: "auto",
														}}
													/>
												</div>
											</ListGroup.Item>

											<ListGroup.Item>
												<div className="d-flex gap-2">
													<label className="d-flex gap-2">
														<Radio
															value={ref(
																modelSettings.settings,
																"coreSource"
															)}
															current="url"
														/>
														<span>
															Load Core From URL
															<small className="d-block text-muted">
																Ideal to load
																sources from a
																local VS Code
																repo.
															</small>
														</span>
													</label>
													<TextBox
														value={ref(
															modelSettings.settings,
															"coreUrl"
														)}
														style={{
															marginLeft: "auto",
															width: "50%",
														}}
													/>
												</div>
											</ListGroup.Item>
										</ListGroup>

										<ListGroup className="p-3">
											<ListGroup.Item>
												<div className="d-flex gap-2">
													<label className="d-flex gap-2">
														<Radio
															value={ref(
																modelSettings.settings,
																"languagesSource"
															)}
															current="latest"
														/>

														<span>
															Load Latest
															Languages
															<small className="d-block text-muted">
																Loads the most
																recent version
																of the Monaco
																languages
																bundled with
																this website.
															</small>
														</span>
													</label>
													<Select
														value={ref(
															modelSettings.settings,
															"latestLanguagesStability"
														)}
														values={StabilityValues}
														getLabel={(v) => v}
														style={{
															width: 100,
															marginLeft: "auto",
														}}
													/>
												</div>
											</ListGroup.Item>
											<ListGroup.Item>
												<div className="d-flex gap-2">
													<label className="d-flex gap-2">
														<Radio
															value={ref(
																modelSettings.settings,
																"languagesSource"
															)}
															current="source"
														/>

														<span>
															Load Languages From
															Source
															<small className="d-block text-muted">
																Loads from the
																typescript
																compiler output.
															</small>
														</span>
													</label>
												</div>
											</ListGroup.Item>
											<ListGroup.Item>
												<div className="d-flex gap-2">
													<label className="d-flex gap-2">
														<Radio
															value={ref(
																modelSettings.settings,
																"languagesSource"
															)}
															current="url"
														/>

														<span>
															Load Languages From
															URL
															<small className="d-block text-muted">
																Ideal to load
																sources from a
																local repo.
															</small>
														</span>
													</label>
													<TextBox
														value={ref(
															modelSettings.settings,
															"languagesUrl"
														)}
														style={{
															marginLeft: "auto",
															width: "50%",
														}}
													/>
												</div>
											</ListGroup.Item>
										</ListGroup>
									</fieldset>
								</Vertical>
							</div>
						</ListGroup.Item>

						<ListGroup.Item>
							<div className="d-flex gap-2">
								<Vertical>
									<Horizontal>
										<label className="d-flex gap-2">
											<Radio
												value={ref(
													modelSettings.settings,
													"monacoSource"
												)}
												current="custom"
											/>

											<span style={{ marginLeft: 8 }}>
												Custom
												<small className="d-block text-muted">
													Provide a complete custom
													configuration.
												</small>
											</span>
										</label>
									</Horizontal>
									<div style={{ height: 200, padding: 10 }}>
										<ControlledMonacoEditor
											value={
												modelSettings.monacoSetupJsonString
											}
											language="json"
											onDidValueChange={
												modelSettings.settings
													.monacoSource === "custom"
													? (value) =>
															(modelSettings.settings.customConfig =
																value)
													: undefined
											}
										/>
									</div>
								</Vertical>
							</div>
						</ListGroup.Item>
					</ListGroup>
				</Modal.Body>
				<Modal.Footer>
					<Button
						variant="secondary"
						onClick={() => model.closeSettingsDialog(false)}
					>
						Close
					</Button>
					<Button
						variant="primary"
						onClick={() => model.closeSettingsDialog(true)}
					>
						Save Changes
					</Button>
				</Modal.Footer>
			</Modal>
		);
	}
}
