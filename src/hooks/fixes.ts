
const fixedImages: { [url: string]: string } = {
    'https://www.thetadrop.com/nft/nft_n2u9wuacttih0tczsjtzrmujpxd8': 'https://user-assets-thetadrop.imgix.net/user_5bh9gz3gh77wj2df2v8g7mf5gug/TigonsNFTs/4471.png?w=500',
    'https://https://imgur.com/gallery/3243g7Y': '',
    'https://imgur.com/a/NMSSSHn': 'https://i.imgur.com/jtYWow7.png',
    'https://www.thetadrop.com/nft/nft_s0emnz2hnatb60pp7zwr3t1fsu4u?m=image_view&nftId=nft_s0emnz2hnatb60pp7zwr3t1fsu4u&editionId=type_h2fbahm15dx0nev5xbpitssfd9n&image=https%3A%2F%2Fuser-assets-thetadrop.imgix.net%2Fuser_rzgh9jwdchn0qatzfqkef0218xf%2Fdrop_nqn9g9rvy37540syriu21etxc79%2FFinals%2FBatch1%2F4414.png': 'https://user-assets-thetadrop.imgix.net/user_rzgh9jwdchn0qatzfqkef0218xf/drop_nqn9g9rvy37540syriu21etxc79/Finals/Batch1/4414.png',
    'https://photos.app.goo.gl/7PJNfvCFWQg5CsXAA': 'https://lh3.googleusercontent.com/pw/AM-JKLUYpdXOeknIpUHExKmscpi7o0vkLgoTmUYrZJGArkueR5afZqBF2IxFmJB2IHuvdD5OwPUyckk9sQutSJsFwsFHubYN2ApwTmNqao3ubS4SxBasZNXJoIR_BJRZaEkkba5YX6kP3DOdZDlEJiqYsE1F=w959-h511-no',
    'https://https://user-assets-thetadrop.imgix.net/user_rzgh9jwdchn0qatzfqkef0218xf/drop_nqn9g9rvy37540syriu21etxc79/Finals/Batch1/3455.png?w=500': 'https://user-assets-thetadrop.imgix.net/user_rzgh9jwdchn0qatzfqkef0218xf/drop_nqn9g9rvy37540syriu21etxc79/Finals/Batch1/3455.png?w=500',
    'https://1drv.ms/u/s!Almi0vMWpft5zVZe3DxoIpL85VM4?e=3PLUiA': 'https://bl6pap003files.storage.live.com/y4mI2JsVU9-NctCrz1N4jlQjU41r-Yz7CC4LHfkCb9DXhJwmheyBqsgs_dOeL2X3N9QCFPW6K44I3mvd9C3KETPmM94Xek3vengLQ3o_aRnUrxgGVO5B7Woq5j7VBOTVs4fx5f77u-i13tz2CPAOQyeEqVPHp0d5kLXWMVrS6kL2iGsQkO4nQLKaxeNNRaQFfCdHOKL4zBBTYSFNaUL2y5OHw/SPS%20%237045.JPG?psid=1&width=663&height=662',
    'https://twitter.com/bigdogjackson': 'https://pbs.twimg.com/profile_images/1468966822862942217/_vBeTHz2_400x400.jpg',
    'https://https://www.thetadrop.com/nft/nft_d75qbrmpuqggrw0hexixzcn40q0u': 'https://user-assets-thetadrop.imgix.net/user_rzgh9jwdchn0qatzfqkef0218xf/drop_nqn9g9rvy37540syriu21etxc79/Finals/Batch1/3731.png?w=500',
    'https:/https://user-assets-thetadrop.imgix.net/user_c14333f0y1c7hnd7jzjf1wz4hsi/airdrops/vip_passaway_badge.png': 'https://user-assets-thetadrop.imgix.net/user_c14333f0y1c7hnd7jzjf1wz4hsi/airdrops/vip_passaway_badge.png',
    'https://mobile.Twitter.com/guruthezeke/status/1516891422074437632/photo/1': 'https://i.imgur.com/r6Jypoz.gif',
    'https://user-assets.thetadrop.com/user_rzgh9jwdchn0qatzfqkef0218xf/challenges/metapine.mp4': 'https://i.postimg.cc/zGWJbrRW/ezgif-5-f40a8cb973.gif',
    'https://user-assets-thetadrop.imgix.net/user_rzgh9jwdchn0qatzfqkef0218xf/drop_nqn9g9rvy37540syriu21etxc79/Finals/Batch1/3803.png?w=290': 'https://user-assets-thetadrop.imgix.net/user_rzgh9jwdchn0qatzfqkef0218xf/drop_nqn9g9rvy37540syriu21etxc79/Finals/Batch1/3803.png?w=290',
    'https://https://user-assets-thetadrop.imgix.net/user_rzgh9jwdchn0qatzfqkef0218xf/drop_nqn9g9rvy37540syriu21etxc79/Finals/Batch1/3803.png?w=290': 'https://user-assets-thetadrop.imgix.net/user_rzgh9jwdchn0qatzfqkef0218xf/drop_nqn9g9rvy37540syriu21etxc79/Finals/Batch1/3803.png?w=290',
    'https://uncom.io': '',
    'https://PNG image (.png)': '',
    'https://www.thetadrop.com/nft/nft_xhffnukphk5n5dc2guju3yz0e9x6?m=image_view&nftId=nft_xhffnukphk5n5dc2guju3yz0e9x6&editionId=type_h2fbahm15dx0nev5xbpitssfd9n&image=https%3A%2F%2Fuser-assets-thetadrop.imgix.net%2Fuser_rzgh9jwdchn0qatzfqkef0218xf%2Fdrop_nqn9g9rvy37540syriu21etxc79%2FFinals%2FBatch1%2F866.png': 'https://user-assets-thetadrop.imgix.net/user_rzgh9jwdchn0qatzfqkef0218xf/drop_nqn9g9rvy37540syriu21etxc79/Finals/Batch1/866.png',
    'https://0x338866f8ba75bb9d7a00502e11b099a2636c2c18/4656/': 'https://lh3.googleusercontent.com/OXNMiPbdMmQmTBr10b-7nDgPTXtBQ-iTSdtEu6HVEGyXdSPd1FlCbk8SghRvWYq8O1N5BKViO_K3BruNfG00evcG9E0RV3NkO6shUw',
    'https://Pic 1420.png': '',
    'https:/': '',
};

export default fixedImages;