<?php
/**
 * Helper class for manipulation array lists
 */



/**
 * Class ListHelper
 *
 */
class ListHelper{
	
	/**
	 * Method to sort list based on a key with Ascending and Descending order
	 * @param unknown_type $list
	 * @param unknown_type $sortKey
	 * @param unknown_type $order
	   Usage ::
		 $resultList = ListHelper::sortThisList($list, "KeyName" ,SORT_ASC); 
		 $resultList = ListHelper::sortThisList($list, "KeyName" ,SORT_DESC); 	 
	 */
	public static function sort($list, $sortKey, $order) {
		if(isset($list) && isset($sortKey)){
			$forKey = array();
			foreach ($list as $key =>$value) {
				$forKey[$key]  = $value[$sortKey];
			}
			array_multisort($forKey, $order, $list);
		}
		return $list;
	}
	
	/**
	 * Method to filter list based on a key's value
	 * @param unknown_type $topUsersList
	 * @param unknown_type $challengeId
	   Usage ::
	   $resultList = ListHelper::filterList($list, "KeyName", $keysFilterValue); 
	 */
	public static function filterList($list, $filterKey, $filterValue){
		foreach ($list as $key => $value) {
			if (isset($value[$filterKey])) {
				if($value[$filterKey] != $filterValue){
					unset($list[$key]);
				}
			} else {
				unset($list[$key]);
			}
		}
		return $list;
	}
	
	/**
	 * Method to return first value from array, list
	 * @param unknown_type $forArray
	 */
	public static function getFirst($list){
		$returnVal = null;
		if (isset($list)) {
			$returnVal = reset($list);
		}
		return $returnVal;
	}
	
	/**
	 * Method to filter some keys from arr
	 * @param unknown_type $list
	 * @param unknown_type $exceptArr
	 */
	public static function except($list, $exceptList) {		
		
		// prepare an empty keys array from given $exceptList and then use array_diff_key
		$except = array();
		foreach($exceptList as $value) {
			$except = array_merge($except, array($value => ''));
		}		
		$returnList  = array_diff_key($list, $except); 		
		return $returnList;		
	}
	
	/**
	 * Method to find only some keys values from list
	 * @param unknown_type $list
	 * @param unknown_type $onlyArr
	 */
	public static function only($list, $onlyList) {		
		$returnList = array();
		foreach ($onlyList as $key => $value) {
			if (!isset($list[$value])) {
				$list[$value] = "";
			}
			$returnList = array_merge($returnList, array($value => $list[$value]));
		}
		return $returnList;
	}
	
	/**
	 * Method to return list based on the count given
	 * @param unknown_type $list
	 * @param unknown_type $onlyArr
	 */
	public static function filterItemsCount($list, $count) {
		$returnList = array();
		$returnList = array_splice($list, 0, $count);
		return $returnList;
	}
	
	/**
	 * Yet Another sort for arrays
	 * @param unknown $array
	 * @param unknown $on
	 * @param string $order
	 * @return multitype:unknown
	 */
	public static function arraySort($array, $on, $order=SORT_ASC){
	
		$new_array = array();
		$sortable_array = array();
	
		if (count($array) > 0) {
			foreach ($array as $k => $v) {
				if (is_array($v)) {
					foreach ($v as $k2 => $v2) {
						if ($k2 == $on) {
							$sortable_array[$k] = $v2;
						}
					}
				} else {
					$sortable_array[$k] = $v;
				}
			}
	
			switch ($order) {
				case SORT_ASC:
					asort($sortable_array);
					break;
				case SORT_DESC:
					arsort($sortable_array);
					break;
			}
	
			foreach ($sortable_array as $k => $v) {
				$new_array[$k] = $array[$k];
			}
		}
	
		return $new_array;
	}
	
	
}
