import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView,} from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { AntDesign } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import RangeSlider from 'rn-range-slider';
import { FilterCriteria } from '@/hooks/useSearchAndFilter';

type Props = {
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
  filterCriteria: FilterCriteria
  isVisible: boolean; 
  onClose: () => void; 
  changeDateTimeFilter: (props: FilterCriteria) => void

}
const FilterModal = (    
    {isVisible, onClose, changeDateTimeFilter, setIsVisible, filterCriteria}: Props
) => {

  //date selection states
  const [startDate, setStartDate] = useState(filterCriteria.startDate);
  const [endDate, setEndDate] = useState(filterCriteria.endDate);

  //time selection states
  const [startTime, setStartTime] = useState<number>(filterCriteria.startTime); 
  const [endTime, setEndTime] = useState<number>(filterCriteria.endTime);

  const isValid = useMemo(() => {
    const currentDate = new Date();
    const currentTime = currentDate.getTime();
    return (startDate <= endDate) && (startTime <= endTime) &&
          (endDate <= currentDate) && (startDate <= currentDate) 
  }, [startDate, endDate, startTime, endTime])

  useEffect(() => {
    setStartDate(filterCriteria.startDate);
    setEndDate(filterCriteria.endDate);
  }, [filterCriteria])
  
  const onChangeStartDate = (event: any, selectedDate:any) => {
    const currentDate = selectedDate || startDate;
    setStartDate(currentDate);  
  };

  const onChangeEndDate = (event:any, selectedDate:any) => {
    const currentDate = selectedDate || endDate;
    setEndDate(currentDate);
  };

  const apply = () => {
    if (!isValid) return;
    changeDateTimeFilter({startDate, endDate, startTime, endTime});
    setIsVisible(false);
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.container}>
          <TouchableOpacity onPress={onClose} style={styles.exitButton}>
            <AntDesign name="closecircle" size={30} color="white" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
              <Text style={{fontWeight: "bold", fontSize: 20}}>Filter: </Text>
          </View>
          <View style={styles.scrollContainer}>
            <View style={styles.DateContainer}>
              <Text>Start: </Text>
              <DateTimePicker
                value={startDate}
                mode="date"
                display="default"
                onChange={onChangeStartDate}
              />
            </View>
            <View style={styles.DateContainer}>
                <Text>End: </Text>

                <DateTimePicker
                  value={endDate}
                  mode="date"
                  display="default"
                  onChange={onChangeEndDate}
                />
            </View>
              <Text style={{marginBottom: -20}}>Pick a time: </Text>
            <View style={styles.timeContainer}>
              <View style={styles.timePickersContainer}>
                <View style={styles.timePicker}>
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={new Date(startTime)}
                    mode={"time"}
                    is24Hour={true}
                    display="default"
                    onChange={(time) => setStartTime(time.nativeEvent.timestamp) }
                  />
                  <Text style={{marginTop: 10}}>Start</Text>
                </View>
                <View style={styles.timePicker}>
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={new Date(endTime)}
                    mode={"time"}
                    is24Hour={true}
                    display="default"
                    onChange={(time) => setEndTime(time.nativeEvent.timestamp)}
                  />
                  <Text style={{marginTop: 10}}>End</Text>
                </View>
 
              </View>
            </View>
          </View>
          <TouchableOpacity 
              onPress={apply} 
              style={{...styles.applyBttn, opacity: isValid ? 1 : 0.5}}
              disabled={!isValid}
          >
            <Text style={{color: "white"}}>Apply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({

  timePickersContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    gap: 15
    // borderColor: "black",
    // borderWidth: 1,
  },
  timePicker: {
    alignItems: "center",
    justifyContent: "center",
    // borderColor: "black",
    // borderWidth: 1,
  },

  titleContainer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    // borderColor: "black",
    // borderWidth: 1,
    alignSelf: "flex-start",
    fontWeight: "bold",
  },

  applyBttn: {
    backgroundColor: "#3d8afe",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    width: "100%"
  },

  DateContainer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    // borderColor: "black",
    // borderWidth: 1,
    flexDirection: "row",
    backgroundColor: "#ffffff"
  },

  timeContainer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    // borderColor: "black",
    // borderWidth: 1,
    backgroundColor: "white",
    flex:1
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  container: {
    backgroundColor: 'white',
    width: "80%", 
    height: "60%",
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },    
  
  exitButton: {
    backgroundColor: "#3d8afe",
    padding: 5,
    borderRadius: 50,
    position: "absolute", 
    top:-20,
    right:-10,
    zIndex: 10
  },
  scrollContainer: {
    flex: 1,
    width: "100%",
    // borderColor: "red",
    // borderWidth: 1,
    padding: 20,
    backgroundColor: "#eaeaea",
    borderRadius: 10,
    // justifyContent: "center",
    gap: 30,
    flexDirection: "column",

  },
})
export default FilterModal