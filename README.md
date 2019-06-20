# ansible-mongodb
## 概要
MongoDBのインストール、起動、レプリカセット構築を自動的に実行するAnsibleの設定ファイル

## 要件
### OS
- CentOS 7 on Hyper-V
    - 仮想環境4台を作成

### ライブラリ
- MongoDB 3.6.13
- Ansible 2.8
    - 4台の内1台にインストール

## 使い方
1. 仮想環境を4台起動
    - 説明のため、各環境のホスト名を以下の通りとする
        - 実際の環境のIPアドレスまたはホスト名に合わせて読み替える

```
Ansible: ansible.example.net
Primary: mongodb1.example.net
Secondary: mongodb2.example.net
Arbiter: mongodb3.example.net
```

2. AnsibleサーバーにSSHでログイン

3. /tmpに以下のファイルを格納

    - 本リポジトリから入手
        - deploy-replica-set.js
        - mongod.conf

    - [Index of RPMS](https://repo.mongodb.org/yum/redhat/7/mongodb-org/3.6/x86_64/RPMS/) から入手
        - mongodb-org-3.6.13-1.el7.x86_64.rpm
        - mongodb-org-mongos-3.6.13-1.el7.x86_64.rpm
        - mongodb-org-server-3.6.13-1.el7.x86_64.rpm
        - mongodb-org-shell-3.6.13-1.el7.x86_64.rpm
        - mongodb-org-tools-3.6.13-1.el7.x86_64.rpm

4. inventoryファイルを作成し、以下を記述して保存
    - 上から順にPrimary、Secondary、ArbiterのIPアドレスまたはホスト名を記述

```sh
$ vi inventory

[db]
mongodb1.example.net
mongodb2.example.net
mongodb3.example.net
```

5. 以下のコマンドを実行してMongoDBをインストール、起動

```sh
$ ansible-playbook -i inventory -u root -k init.yml
```

6. 以下のコマンドを実行してMongoDBのレプリカセットを構築

```sh
$ ansible-playbook -i inventory -u root -k replication.yml
```

## レプリカセット構築の確認方法

1. PrimaryサーバーにSSHでログイン

2. 以下のコマンドを実行
    - 各サーバーがPrimary、Secondary、Arbiterに割り当てられていればOK

```sh
$ mongo
rs0:PRIMARY> rs.status()
```

3. Primary サーバーをシャットダウン

4. Secondary サーバーにSSHでログイン

5. 2.と同じコマンドを実行
    - 2.の時点でSecondaryだったサーバーがPrimaryに昇格していればOK
    - 昇格には時間がかかるので、昇格していなければ時間をおいてコマンドを再実行

6. 3.でシャットダウンしたサーバーを再起動し、SSHでログイン

7. 2.と同じコマンドを実行
    - 再起動したサーバーがSecondaryサーバーとして表示されていればOK