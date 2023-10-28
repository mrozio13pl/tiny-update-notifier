export declare interface Pkg {
    /** Name of the package */
    name: string;
    /** Package version */
    version: string;
}

export declare interface Options {
    pkg: Pkg;

    /**
     * How often to check for updates (milliseconds).
     * Default: 1 day
     */
    checkInterval?: number;

    /**
     * Which dist-tag to use
     * @default 'latest'
     */
    distTag?: string;

    /**
     * Should cache be used
     * @default true
     */
    cache?: boolean;

    /**
     * Request timeout (milliseconds)
     * @default 30000
     */
    timeout?: number;
}

/** Difference type between two semver versions */
export declare type ReleaseType =
    | 'major'
    | 'premajor'
    | 'minor'
    | 'preminor'
    | 'patch'
    | 'prepatch'
    | 'prerelease';

export declare interface Update {
    name: Pkg['name'];

    /** Latest version */
    latest: string;

    /** Current version */
    current: string;

    readonly type: ReleaseType;
}