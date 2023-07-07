/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as lzma from "lzma/src/lzma_worker";
import * as msgpack from "messagepack";
import * as base64 from "base64-js";

export class LzmaCompressor<T> {
	encodeData<T>(json: T): string {
		// normalize undefined
		json = JSON.parse(JSON.stringify(json));
		const data = msgpack.encode(json);
		const compressed = new Uint8Array(lzma.LZMA.compress(data, 9));

		const compressedStr = base64.fromByteArray(compressed);
		if (compressedStr.indexOf("undefined") !== -1) {
			debugger;
		}
		const result = compressedStr
			.replace(/\+/g, "-") // Convert '+' to '-'
			.replace(/\//g, "_") // Convert '/' to '_'
			.replace(/=+$/, ""); // Remove ending '='

		return result;
	}

	decodeData<T>(data: string): T {
		data += Array(5 - (data.length % 4)).join("=");
		data = data
			.replace(/\-/g, "+") // Convert '-' to '+'
			.replace(/\_/g, "/"); // Convert '_' to '/'
		const compressed2 = base64.toByteArray(data);
		const decompressed = lzma.LZMA.decompress(compressed2);
		const origData = msgpack.decode(new Uint8Array(decompressed));
		return origData as T;
	}
}
