#!/bin/bash

# load .env file and config file
loadConfig() {
    DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    export $(egrep -v '^#' "${DIR}/config/default.conf" | xargs)
    export $(egrep -v '^#' "${DIR}/.env" | xargs)
}

# update the host system
update() {
  apt-get update
  apt-get upgrade
}

# docker installation
installDocker() {
  apt-get remove docker docker-engine docker.io containerd runc
  apt-get update
  curl -sSL https://get.docker.com | sh
  sudo usermod -a -G docker pi
}

# create ssh key
createSSHKey() {
  local SSH_KEY_NAME="${PROJECT_NAME}-${SERVICE_NAME}-docker"
  local SSH_KEY_FILE="${SSH_HOST_KEY_FOLDER}/${SSH_KEY_NAME}"
  local SSH_AUTH_FILE="${SSH_HOST_KEY_FOLDER}/authorized_keys"
  # generate a key
  ssh-keygen -t rsa -b 4096 -C "root" -f "${SSH_KEY_FILE}" -N ""
  # create a new empty SSH_AUTH_FILE, if not exists
  [ ! -f "${SSH_AUTH_FILE}" ] && touch "${SSH_AUTH_FILE}"
  # backup auth file on the first call
  backupConfig "${SSH_AUTH_FILE}"
  # restore the backup auth file
  restoreConfig "${SSH_AUTH_FILE}"
  # add the key to the auhtorized keys
  cat "${SSH_KEY_FILE}".pub >>"${SSH_AUTH_FILE}"
}

# backup a config file
backupConfig() {
  local CONFIG_FILE=$1
  [ ! -f "${CONFIG_FILE}.backup" ] && cp "${CONFIG_FILE}" "${CONFIG_FILE}.backup"
}
# restore the ssh server config if the file exists
restoreConfig() {
  local CONFIG_FILE=$1
  [ -f "${CONFIG_FILE}.backup" ] && rm "${CONFIG_FILE}" && cp "${CONFIG_FILE}.backup" "${CONFIG_FILE}" && /etc/init.d/ssh reload
}

# replace strings
replaceSSHConfig() {
  local FROM=$1
  local TO=$2
  local SSHD_CONFIG_FILE="/etc/ssh/sshd_config"

  # replace from config file into a new (tmp) file
  cat "${SSHD_CONFIG_FILE}" | sed "s|${FROM}|${TO}|g" >"${SSHD_CONFIG_FILE}.tmp"
  # backup the first untouched version of the config file
  backupConfig "${SSHD_CONFIG_FILE}"
  # remove config file
  rm "${SSHD_CONFIG_FILE}"
  # move the temp file as new config file
  mv "${SSHD_CONFIG_FILE}.tmp" "${SSHD_CONFIG_FILE}"

  # reload ssh server configuration
  /etc/init.d/ssh reload
}

# write ssh server configuration
setSSHServerConfig() {
  # for testing
  restoreConfig "/etc/ssh/sshd_config"
  #
  replaceSSHConfig "#PubkeyAuthentication" "PubkeyAuthentication"
  replaceSSHConfig "PubkeyAuthentication[^\"]*no" "PubkeyAuthentication yes"
  replaceSSHConfig "#AuthorizedKeysFile" "AuthorizedKeysFile"
}

#----------------------------------------------------------------------------------------------------------------------

loadConfig

echo ""
echo "Update system?"
select yn in "Yes" "No"; do
    case $yn in
        Yes ) update; break;;
        No ) break;;
    esac
done

echo ""
echo "Install Docker?"
select yn in "Yes" "No"; do
    case $yn in
        Yes ) installDocker; break;;
        No ) break;;
    esac
done

echo ""
echo "Create SSH key?"
select yn in "Yes" "No"; do
    case $yn in
        Yes ) createSSHKey; break;;
        No ) break;;
    esac
done

echo ""
echo "Update SSH server config?"
select yn in "Yes" "No"; do
    case $yn in
        Yes ) setSSHServerConfig; break;;
        No ) break;;
    esac
done

echo ""