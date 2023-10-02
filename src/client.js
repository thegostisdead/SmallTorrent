
// https://www.bittorrent.org/beps/bep_0003.html#trackers



// https://www.bittorrent.org/beps/bep_0003.html#peer-messages
const PeerMessages = {
    
	0 : " choke",// no payload
    1 : " unchoke",// no payload
    2 : " interested",// no payload
    3 : " not interested",
    4 : " have",
    5 : " bitfield",
    6 : " request",
    7 : " piece",
    8 : " cancel",
}



class Client {


    constructor() {
        this.tracker
        this.info_hash
        this.peer_id
        // optional 
        this.ip
        // The port number this peer is listening on.
        this.port
        // The total amount uploaded so far, encoded in base ten ascii.
        this.uploaded
        // The total amount downloaded so far, encoded in base ten ascii.
        this.downloaded
        // The number of bytes this peer still has to download, encoded in base ten ascii.
        this.left
        // optional :  started, completed, or stopped 
        this.event
        this.compact
    }

    buildUrl() {

        const params = {
           "info_hash" : this.info_hash,
           "peer_id" : this.peer_id,
           "uploaded": this.uploaded,
           "downloaded": this.downloaded,
           "left": this.left,
           "port": this.port
        }
        
        return this.tracker + Object.keys(params).map(key => key + '=' + params[key]).join('&');

    }


    async discoverPeers() {

        const url = this.buildUrl()
        
        let response; 

        try {
            response = await fetch(url);
        } catch (error) {
            console.error(error)
        }

    }


}