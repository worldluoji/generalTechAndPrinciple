# FileSystem

<img src="./images/FileSystem.webp" />

Linux 里有一个特点，那就是一切皆文件:
- 1）一个进程的输出可以作为另一个进程的输入，这种方式称为管道，管道也是一个文件。
- 2）进程可以通过网络和其他进程进行通信，建立的 Socket，也是一个文件。
- 3）进程运行起来，要想看到进程运行的情况，会在 /proc 下面有对应的进程号，还是一系列文件。
每个文件，Linux 都会分配一个文件描述符（File Descriptor），这是一个整数。
有了这个文件描述符，我们就可以使用系统调用，查看或者干预进程运行的方方面面。

## 几个要点
- 1) 如果文件系统中有的文件是热点文件，近期经常被读取和写入，文件系统应该有缓存层
- 2) Linux 内核要在自己的内存里面维护一套数据结构，来保存哪些文件被哪些进程打开和使用
- 3) 文件系统要有严格的组织形式，使得文件能够以块为单位进行存储
- 4) 文件系统中也要有索引区，用来方便查找一个文件分成的多个块都存放在了什么位置。


## 1. 文件系统类型
- ext2/3/4：是Linux中最常用的本地文件系统，ext3是ext2的升级版，引入了日志功能，增强了系统崩溃后的恢复能力。ext4在此基础上进一步提升了性能和扩展性。
- XFS：设计用于处理大量数据和大文件，提供了良好的可伸缩性和性能。
- Btrfs：是一种现代化的文件系统，支持写时复制（Copy-on-write）、快照、数据校验和卷管理功能。
- tmpfs：基于内存的文件系统，文件存储在RAM中，速度极快，但重启后数据丢失。
- NFS：网络文件系统，允许跨网络共享文件，常用于多主机间的数据共享。

## 2. 格式化
也即将一块盘使用命令组织成一定格式的文件系统的过程。
使用 Windows 的时候，咱们常格式化的格式为 NTFS（New Technology File System）。
在 Linux 下面，常用的是 ext3 或者 ext4。

我们可以通过命令 fdisk -l，查看格式化和没有格式化的分区。
```
[root@kube-master ~]# fdisk -l

Disk /dev/vda: 53.7 GB, 53687091200 bytes, 104857600 sectors
Units = sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disk label type: dos
Disk identifier: 0x000d64b4

   Device Boot      Start         End      Blocks   Id  System
/dev/vda1   *        2048   104857566    52427759+  83  Linux

Disk /dev/vdb: 107.4 GB, 107374182400 bytes, 209715200 sectors
Units = sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
```
可以看到，/dev/vda1是已经格式化了的，而/dev/vdb是没有格式化的。

我们可以通过命令 mkfs.ext3 或者 mkfs.ext4 进行格式化。
mkfs.ext4 /dev/vdb

如果要分为多个区，则使用交互式命令进行
fdisk /dev/vdb

## 3. mount
在Linux中，文件系统通过挂载点挂载到目录树的不同位置。文件系统层次标准（Filesystem Hierarchy Standard, FHS）定义了主要目录和文件的组织结构，如/bin存放用户可执行文件，/etc存放系统配置文件等，确保了跨系统的一致性。

格式化后的硬盘，需要挂在到某个目录下面，才能作为普通的文件系统进行访问。
```
mount /dev/vdb1 /根目录/用户A目录/目录1
```
上面这个命令就是将这个文件系统挂载到“/ 根目录 / 用户 A 目录 / 目录 1”这个目录下面。
一旦挂在过去，“/ 根目录 / 用户 A 目录 / 目录 1”这个目录下面原来的文件 1 和文件 2 就都看不到了，
换成了 vdc1 这个硬盘里面的文件系统的根目录。

有挂载就有卸载，卸载使用 umount 命令。
```
umount /根目录/用户A目录/目录
```

## 4. ls -l
Linux 里面一切都是文件，那从哪里看出是什么文件呢？要从 ls -l 的结果的第一位标识位看出来。
- 表示普通文件；
d 表示文件夹；
c 表示字符设备文件；
b 表示块设备文件；
s 表示套接字 socket 文件；
l 表示符号链接，也即软链接，就是通过名字指向另外一个文件，
例如下面的代码，instance 这个文件就是指向了 /var/lib/cloud/instances 这个文件
```
# ls -l
lrwxrwxrwx 1 root root   61 Dec 14 19:53 instance -> /var/lib/cloud/instances
```

## 4. 硬盘
文件系统将磁盘空间划分为固定大小的块（Block），作为数据读写的基本单位。一些文件系统还可能使用簇（Cluster）的概念，簇是连续的块集合，最小分配单元可能大于单个块，以减少元数据开销。

一块的大小是扇区大小的整数倍，默认是 4K。在格式化的时候，这个值是可以设定的。

Block带来了灵活性，但也需要额外增加维护信息：
- 1) 维护“某个文件分成几块、每一块在哪里”等等这些基本信息
- 2) 文件还有元数据部分，例如名字、权限等
这就需要一个结构 inode 来存放。

什么是 inode 呢？inode 的“i”是 index 的意思，其实就是“索引”，类似图书馆的索引区域。

每个文件或目录在Linux文件系统中都有一个唯一的索引节点（inode），它存储了文件的元数据，如文件大小、所有者、权限、创建和修改时间、链接数以及数据块的指针。inode不包含文件名，文件名与inode之间的关联通过目录项维护。

目录项记录了文件名和该文件对应的inode编号，形成了文件系统中的目录结构。目录实质上也是一种特殊类型的文件，存储着它包含的文件和子目录的inode编号及名称。

例如: ext4_indde
```
struct ext4_inode {
   __le16  i_mode;    /* File mode */
   __le16  i_uid;    /* Low 16 bits of Owner Uid */
   __le32  i_size_lo;  /* Size in bytes */
   __le32  i_atime;  /* Access time */
   __le32  i_ctime;  /* Inode Change time */
   __le32  i_mtime;  /* Modification time */
   __le32  i_dtime;  /* Deletion Time */
   __le16  i_gid;    /* Low 16 bits of Group Id */
   __le16  i_links_count;  /* Links count */
   __le32  i_blocks_lo;  /* Blocks count */
   __le32  i_flags;  /* File flags */
 ......
   __le32  i_block[EXT4_N_BLOCKS];/* Pointers to blocks */
   __le32  i_generation;  /* File version (for NFS) */
   __le32  i_file_acl_lo;  /* File ACL */
   __le32  i_size_high;
 ......
 };
```
可以看到，inode 里面有文件的读写权限 i_mode，属于哪个用户 i_uid，哪个组 i_gid，
大小是多少 i_size_io，占用多少个块 i_blocks_io。

“某个文件分成几块、每一块在哪里”，这些在 inode 里面，应该保存在 i_block 里面。

## 5. 权限与访问控制
Linux文件系统严格遵循UNIX权限模型，包括拥有者、所属组和其他用户的读、写、执行权限。SELinux和AppArmor等机制提供了额外的安全层，用于实施更细粒度的访问控制。