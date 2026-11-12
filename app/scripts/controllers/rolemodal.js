'use strict'

export function RoleModalCtrl ($rootScope, $scope, $uibModalInstance, $timeout, Api, Notify, Alerting, role) {
  $scope.update = !!role
  $scope.role = role ? angular.copy(role) : { name: '', description: '', permissions: getDefaultPermissions() }

  $scope.selectedTab = { basicInfo: true, permissions: false }

  function getDefaultPermissions () {
    return {
      'channel-view-all': false,
      'channel-manage-all': false,
      'client-view-all': false,
      'client-manage-all': false,
      'client-role-view-all': false,
      'client-role-manage-all': false,
      'transaction-view-all': false,
      'transaction-view-body-all': false,
      'transaction-rerun-all': false,
      'user-view': false,
      'user-manage': false,
      'user-role-view': false,
      'user-role-manage': false,
      'audit-trail-view': false,
      'audit-trail-manage': false,
      'contact-list-view': false,
      'contact-list-manage': false,
      'mediator-view-all': false,
      'mediator-manage-all': false,
      'certificates-view': false,
      'certificates-manage': false,
      'logs-view': false,
      'import-export': false,
      'app-view-all': false,
      'app-manage-all': false,
      'visualizer-manage': false,
      'visualizer-view': false,
      'channel-view-specified': [],
      'channel-manage-specified': [],
      'client-view-specified': [],
      'client-manage-specified': [],
      'client-role-view-specified': [],
      'client-role-manage-specified': [],
      'transaction-view-specified': [],
      'transaction-view-body-specified': [],
      'transaction-rerun-specified': [],
      'mediator-view-specified': [],
      'mediator-manage-specified': [],
      'app-view-specified': [],
      'app-manage-specified': []
    }
  }

  $scope.globalPermissions = function (key) {
    return key.indexOf('-specified') === -1
  }

  $scope.specifiedPermissions = function (key) {
    return key.indexOf('-specified') !== -1
  }

  $scope.getGlobalPermissions = function () {
    const result = {}
    angular.forEach($scope.role.permissions, function (value, key) {
      if ($scope.globalPermissions(key)) {
        result[key] = value
      }
    })
    return result
  }

  $scope.getSpecifiedPermissions = function () {
    const result = {}
    angular.forEach($scope.role.permissions, function (value, key) {
      if ($scope.specifiedPermissions(key)) {
        result[key] = value
      }
    })
    return result
  }

  $scope.formatPermissionName = function (key) {
    return key
      .replace(/-/g, ' ')
      .replace(/\b\w/g, function (l) { return l.toUpperCase() })
      .replace(' specified', ' (specific)')
  }

  $scope.newSpecifiedItem = {}

  $scope.addSpecifiedItem = function (key) {
    const value = $scope.newSpecifiedItem[key]
    if (value && value.trim()) {
      if (!$scope.role.permissions[key]) {
        $scope.role.permissions[key] = []
      }
      if ($scope.role.permissions[key].indexOf(value.trim()) === -1) {
        $scope.role.permissions[key].push(value.trim())
      }
      $scope.newSpecifiedItem[key] = ''
    }
  }

  $scope.removeSpecifiedItem = function (key, index) {
    $scope.role.permissions[key].splice(index, 1)
  }

  const notifyUser = function () {
    Notify.notify('clientsChanged')
    $uibModalInstance.close()
  }

  const success = function () {
    Alerting.AlertAddMsg('role', 'success', 'The role has been saved successfully')
    notifyUser()
  }

  const error = function (err) {
    Alerting.AlertAddMsg('role', 'danger', 'An error has occurred while saving the role: #' + err.status + ' - ' + err.data)
    notifyUser()
  }

  const saveRole = function (role) {
    if ($scope.update) {
      const updateBody = angular.copy(role)
      updateBody.name = undefined
      Api.Roles.update({ name: role.name }, updateBody, success, error)
    } else {
      Api.Roles.save(role, success, error)
    }
  }

  $scope.validateFormRole = function () {
    Alerting.AlertReset('hasErrors')
    $timeout.cancel($scope.clearValidation)
    $scope.ngError = {}
    $scope.ngError.hasErrors = false

    if (!$scope.role.name) {
      $scope.ngError.name = true
      $scope.ngError.hasErrors = true
      $scope.ngError.roleBasicInfoTab = true
    }

    if ($scope.ngError.hasErrors) {
      $scope.clearValidation = $timeout(function () {
        $scope.ngError = {}
        Alerting.AlertReset('hasErrors')
      }, 5000)
      Alerting.AlertAddMsg('hasErrors', 'danger', $scope.validationFormErrorsMsg)
    }
  }

  $scope.submitFormRole = function () {
    $scope.validateFormRole()
    if ($scope.ngError.hasErrors === false) {
      saveRole($scope.role)
    }
  }

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel')
  }
}
