// only implement support for single-file torrents


class TorrentFile {


    constructor(announce, info) {
        // tracker url 
        this.announce

        this.info = {}
        //  size of the file in bytes, for single-file torrents
        this.info.length
        // suggested name to save the file / directory as
        this.info.name
        //  number of bytes in each piece
        this.info["piece length"]
        // concatenated SHA-1 hashes of each piece
        this.pieces
    }

    

}