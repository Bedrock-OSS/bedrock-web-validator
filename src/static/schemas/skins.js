'use strict'
export default validate20
var schema22 = {
	title: 'Skip Pack',
	description: 'Skin pack definition',
	type: 'object',
	additionalProperties: false,
	required: ['serialize_name', 'localization_name', 'skins'],
	properties: {
		serialize_name: {
			title: 'Serialize Name',
			description:
				'The name of the pack as an identifier, they must be the same as the name of pack without spaces',
			type: 'string',
		},
		localization_name: {
			title: 'Locatlization Name',
			description: 'The key in the language file to use to display text',
			type: 'string',
		},
		skins: {
			type: 'array',
			title: 'Skins',
			description: 'An array of item',
			items: {
				title: 'Skin',
				description: 'A single skin definition',
				additionalProperties: false,
				required: ['localization_name', 'geometry', 'texture', 'type'],
				properties: {
					localization_name: {
						title: 'Locatlization Name',
						description:
							'The key in the language file to use to display text',
						type: 'string',
					},
					geometry: {
						title: 'Geometry',
						description: 'The type of geometry to use',
						enum: [
							'geometry.humanoid.custom',
							'geometry.humanoid.customSlim',
						],
					},
					texture: {
						title: 'Texture',
						description: 'The filename of the skin',
						pattern: '^.*\\.png$',
					},
					type: {
						title: 'Type',
						description: 'The type of skin',
						enum: ['free', 'paid'],
					},
				},
			},
		},
	},
	definitions: {},
}
// var func0 = require('ajv/dist/runtime/equal').default
var pattern0 = new RegExp('^.*\\.png$', 'u')

function validate20(data, valCxt) {
	'use strict'
	if (valCxt) {
		var instancePath = valCxt.instancePath
		var parentData = valCxt.parentData
		var parentDataProperty = valCxt.parentDataProperty
		var rootData = valCxt.rootData
	} else {
		var instancePath = ''
		var parentData = undefined
		var parentDataProperty = undefined
		var rootData = data
	}
	var vErrors = null
	var errors = 0
	if (errors === 0) {
		if (data && typeof data == 'object' && !Array.isArray(data)) {
			var missing0
			if (
				(data.serialize_name === undefined &&
					(missing0 = 'serialize_name')) ||
				(data.localization_name === undefined &&
					(missing0 = 'localization_name')) ||
				(data.skins === undefined && (missing0 = 'skins'))
			) {
				validate20.errors = [
					{
						instancePath: instancePath,
						schemaPath: '#/required',
						keyword: 'required',
						params: { missingProperty: missing0 },
						message:
							"must have required property '" + missing0 + "'",
					},
				]
				return false
			} else {
				var _errs1 = errors
				for (var key0 in data) {
					if (
						!(
							key0 === 'serialize_name' ||
							key0 === 'localization_name' ||
							key0 === 'skins'
						)
					) {
						validate20.errors = [
							{
								instancePath: instancePath,
								schemaPath: '#/additionalProperties',
								keyword: 'additionalProperties',
								params: { additionalProperty: key0 },
								message: 'must NOT have additional properties',
							},
						]
						return false
						break
					}
				}
				if (_errs1 === errors) {
					if (data.serialize_name !== undefined) {
						var _errs2 = errors
						if (typeof data.serialize_name !== 'string') {
							validate20.errors = [
								{
									instancePath:
										instancePath + '/serialize_name',
									schemaPath:
										'#/properties/serialize_name/type',
									keyword: 'type',
									params: { type: 'string' },
									message: 'must be string',
								},
							]
							return false
						}
						var valid0 = _errs2 === errors
					} else {
						var valid0 = true
					}
					if (valid0) {
						if (data.localization_name !== undefined) {
							var _errs4 = errors
							if (typeof data.localization_name !== 'string') {
								validate20.errors = [
									{
										instancePath:
											instancePath + '/localization_name',
										schemaPath:
											'#/properties/localization_name/type',
										keyword: 'type',
										params: { type: 'string' },
										message: 'must be string',
									},
								]
								return false
							}
							var valid0 = _errs4 === errors
						} else {
							var valid0 = true
						}
						if (valid0) {
							if (data.skins !== undefined) {
								var data2 = data.skins
								var _errs6 = errors
								if (errors === _errs6) {
									if (Array.isArray(data2)) {
										var valid1 = true
										var len0 = data2.length
										for (var i0 = 0; i0 < len0; i0++) {
											var data3 = data2[i0]
											var _errs8 = errors
											if (
												data3 &&
												typeof data3 == 'object' &&
												!Array.isArray(data3)
											) {
												var missing1
												if (
													(data3.localization_name ===
														undefined &&
														(missing1 =
															'localization_name')) ||
													(data3.geometry ===
														undefined &&
														(missing1 =
															'geometry')) ||
													(data3.texture ===
														undefined &&
														(missing1 =
															'texture')) ||
													(data3.type === undefined &&
														(missing1 = 'type'))
												) {
													validate20.errors = [
														{
															instancePath:
																instancePath +
																'/skins/' +
																i0,
															schemaPath:
																'#/properties/skins/items/required',
															keyword: 'required',
															params: {
																missingProperty:
																	missing1,
															},
															message:
																"must have required property '" +
																missing1 +
																"'",
														},
													]
													return false
												} else {
													var _errs9 = errors
													for (var key1 in data3) {
														if (
															!(
																key1 ===
																	'localization_name' ||
																key1 ===
																	'geometry' ||
																key1 ===
																	'texture' ||
																key1 === 'type'
															)
														) {
															validate20.errors =
																[
																	{
																		instancePath:
																			instancePath +
																			'/skins/' +
																			i0,
																		schemaPath:
																			'#/properties/skins/items/additionalProperties',
																		keyword:
																			'additionalProperties',
																		params: {
																			additionalProperty:
																				key1,
																		},
																		message:
																			'must NOT have additional properties',
																	},
																]
															return false
															break
														}
													}
													if (_errs9 === errors) {
														if (
															data3.localization_name !==
															undefined
														) {
															var _errs10 = errors
															if (
																typeof data3.localization_name !==
																'string'
															) {
																validate20.errors =
																	[
																		{
																			instancePath:
																				instancePath +
																				'/skins/' +
																				i0 +
																				'/localization_name',
																			schemaPath:
																				'#/properties/skins/items/properties/localization_name/type',
																			keyword:
																				'type',
																			params: {
																				type: 'string',
																			},
																			message:
																				'must be string',
																		},
																	]
																return false
															}
															var valid2 =
																_errs10 ===
																errors
														} else {
															var valid2 = true
														}
														if (valid2) {
															if (
																data3.geometry !==
																undefined
															) {
																var data5 =
																	data3.geometry
																var _errs12 =
																	errors
																if (
																	!(
																		data5 ===
																			'geometry.humanoid.custom' ||
																		data5 ===
																			'geometry.humanoid.customSlim'
																	)
																) {
																	validate20.errors =
																		[
																			{
																				instancePath:
																					instancePath +
																					'/skins/' +
																					i0 +
																					'/geometry',
																				schemaPath:
																					'#/properties/skins/items/properties/geometry/enum',
																				keyword:
																					'enum',
																				params: {
																					allowedValues:
																						schema22
																							.properties
																							.skins
																							.items
																							.properties
																							.geometry
																							.enum,
																				},
																				message:
																					'must be equal to one of the allowed values',
																			},
																		]
																	return false
																}
																var valid2 =
																	_errs12 ===
																	errors
															} else {
																var valid2 = true
															}
															if (valid2) {
																if (
																	data3.texture !==
																	undefined
																) {
																	var data6 =
																		data3.texture
																	var _errs13 =
																		errors
																	if (
																		typeof data6 ===
																		'string'
																	) {
																		if (
																			!pattern0.test(
																				data6
																			)
																		) {
																			validate20.errors =
																				[
																					{
																						instancePath:
																							instancePath +
																							'/skins/' +
																							i0 +
																							'/texture',
																						schemaPath:
																							'#/properties/skins/items/properties/texture/pattern',
																						keyword:
																							'pattern',
																						params: {
																							pattern:
																								'^.*\\.png$',
																						},
																						message:
																							'must match pattern "' +
																							'^.*\\.png$' +
																							'"',
																					},
																				]
																			return false
																		}
																	}
																	var valid2 =
																		_errs13 ===
																		errors
																} else {
																	var valid2 = true
																}
																if (valid2) {
																	if (
																		data3.type !==
																		undefined
																	) {
																		var data7 =
																			data3.type
																		var _errs14 =
																			errors
																		if (
																			!(
																				data7 ===
																					'free' ||
																				data7 ===
																					'paid'
																			)
																		) {
																			validate20.errors =
																				[
																					{
																						instancePath:
																							instancePath +
																							'/skins/' +
																							i0 +
																							'/type',
																						schemaPath:
																							'#/properties/skins/items/properties/type/enum',
																						keyword:
																							'enum',
																						params: {
																							allowedValues:
																								schema22
																									.properties
																									.skins
																									.items
																									.properties
																									.type
																									.enum,
																						},
																						message:
																							'must be equal to one of the allowed values',
																					},
																				]
																			return false
																		}
																		var valid2 =
																			_errs14 ===
																			errors
																	} else {
																		var valid2 = true
																	}
																}
															}
														}
													}
												}
											}
											var valid1 = _errs8 === errors
											if (!valid1) {
												break
											}
										}
									} else {
										validate20.errors = [
											{
												instancePath:
													instancePath + '/skins',
												schemaPath:
													'#/properties/skins/type',
												keyword: 'type',
												params: { type: 'array' },
												message: 'must be array',
											},
										]
										return false
									}
								}
								var valid0 = _errs6 === errors
							} else {
								var valid0 = true
							}
						}
					}
				}
			}
		} else {
			validate20.errors = [
				{
					instancePath: instancePath,
					schemaPath: '#/type',
					keyword: 'type',
					params: { type: 'object' },
					message: 'must be object',
				},
			]
			return false
		}
	}
	validate20.errors = vErrors
	return errors === 0
}
