import { Manifest } from '..'

export const getManifest = (): Manifest =>
    chrome.runtime.getManifest() as Manifest
