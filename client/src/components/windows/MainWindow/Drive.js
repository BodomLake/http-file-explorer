export default class Drive {
  constructor(fstype, size, used, avail, pcent, target, volumeName, fileSystem) {
    /**
     * POSIX - File system type
     *
     * Win32 - Win32_LogicalDisk DriveType(as `String`!):
     * - "0": Unknown
     * - "1": No Root Directory
     * - "2": Removable Disk
     * - "3": Local Disk
     * - "4": Network Drive
     * - "5": Compact Disc
     * - "6": RAM Disk
     */
    this.fstype = fstype || '3'
    this.size = size || 0
    this.used = used || 0
    this.avail = avail || 0
    this.pcent = pcent || 0
    this.target = target || 'C:'
    this.volumeName = volumeName || ''
    this.fileSystem = fileSystem || ''
  }
}
